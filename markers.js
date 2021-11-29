//-----------------------------------------------------------------------------
//-------------------------------------------------------------------------CCTV
var serviceKey_CCTV = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D";
var insttNm_CCTV1 = "부산광역시%20재난현장관리과"
var insttNm_CCTV2 = "부산광역시%20남구청"
// 남구청만 일단 추가했습니다.
// insttNm_CCTV3 = "부산광역시%20금정구청" 같이 새로 변수 만들어서 fetch하면 그 구역 CCTV도 나옵니다.

function getCCTV() {
    var imgSrc = 'assets/cctv.png'
    
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40), 
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 
        var markers = [];
    fetch("https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_cctv_api?serviceKey=" + serviceKey_CCTV + "&numOfRows=100&type=json&institutionNm=" + insttNm_CCTV1)
        .then((res) => res.json())
        .then((resJson) => {
            var items = resJson.response.body.items;
            for (var i = 0; i < items.length; i++) {
                //마커의 이미지 정보
                var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치입니다
                
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(items[i].latitude, items[i].longitude),
                    map: map,
                    image: markerImage,
                });
                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">CCTV</div>',// 정보창에 이름 표시
                });
                // 마커 이벤트리스너 등록
				kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
				kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                markers.push(marker);
            }
            clusterer.addMarkers(markers);
        })
    fetch("https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_cctv_api?serviceKey=" + serviceKey_CCTV + "&numOfRows=100&type=json&institutionNm=" + insttNm_CCTV2)
        .then((res) => res.json())
        .then((resJson) => {
             
            var items = resJson.response.body.items;
            for (var i = 0; i < items.length; i++) {
                //마커의 이미지 정보
                var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치입니다

                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(items[i].latitude, items[i].longitude),
                    map: map,
                    image: markerImage,
                });
                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">CCTV</div>',// 정보창에 이름 표시
                });
                // 마커 이벤트리스너 등록
				kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
				kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                markers.push(marker);
            }
            clusterer.addMarkers(markers);
            CCTV_markers = markers;
        })
}

//-----------------------------------------------------------------------------
//------------------------------------------------------------------------비상벨
var serviceKey_emergencyBell = 'i0omZLilsWQxFd3kY5EnR0GjiK1v%2BbymoppTqZykRtT9hRyM4QCxVyW4gcV%2BczyPKQSAH17efFCAbzELgv0wDA%3D%3D';
function getEmergencyBell(){
    //비상벨 이미지
    var imgSrc = 'assets/emergencyBell.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40), 
        //마커 이미지의 옵션, 손가락 끝이 해당 좌표를 가리키도록 위치시켰습니다. 
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 

    /* 아래의 api는 geocoder로 서버 있어야 작동해서 이 파일에서는 주석 처리 해놓았습니다. 
    //비상벨 api
	const emergencyBellUrl = 'https://api.odcloud.kr/api/15036883/v1/uddi:d176e39b-b12c-4d80-bcc6-c828693bacb6_201910111559?page=1&perPage=80&serviceKey=' + serviceKey_emergencyBell;
	// 비상벨 api 지도에 표시
	fetch(emergencyBellUrl)
		.then((res) => res.json())
		.then((resJson) => {
			var markers = [];
			var bells = resJson.data;
			for (var i = 0; i < bells.length; i++) {
				var adress = bells[i]["주        소"];
				
				// 주소로 좌표를 검색
                //해당 함수를 불러오려면 호출 코드에 geocoder 정보가 필요
				geocoder.addressSearch(adress, function(result, status) {
					// 정상적으로 검색이 완료됐으면 
					if (status === kakao.maps.services.Status.OK) {
						var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
	
                        //마커의 이미지 정보
						var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
    						markerPosition = new kakao.maps.LatLng(coords); // 마커가 표시될 위치입니다

						// 결과값으로 받은 위치를 마커로 표시합니다
						var marker = new kakao.maps.Marker({
							map: map,
							position: coords,
							image: markerImage
						});
							
			
						var infoWindow = new kakao.maps.InfoWindow({
							content: '<div style="width:150px;text-align:center;padding:6px 0;">비상벨</div>',// 정보창에 이름 표시
						});
						// 마커 추가
						markers.push(marker);
						
						// 마커 이벤트리스너 등록
						kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
						kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
					} 
				}); 
			}
			clusterer.addMarkers(markers);
		});
        */
    //남구 안심귀갓길 api
	const Namgu_emergencyBellUrl = 'https://api.odcloud.kr/api/15060673/v1/uddi:8a1b0865-d795-44ff-8103-da53fea05140?page=1&perPage=20&serviceKey=' + serviceKey_emergencyBell;
	
    //남구 비상벨 지도에 표시
    fetch(Namgu_emergencyBellUrl)
    .then((res) => res.json())
    .then((resJson) => {
        var markers = []; 
        var centers = resJson.data;

        for (var i = 0; i < centers.length; i++) { // 좌표 가져오기
            //그림자 조명은 제외하고 비상벨만 표시
            if(centers[i]["구분"] == "그림자조명") continue;
            var lat = centers[i]["위도"];
            var lng = centers[i]["경도"];

            //마커의 이미지 정보
            var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                   markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                image: markerImage
            });

            var infoWindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">비상벨</div>',// 정보창에 이름 표시
            });

            // 마커 추가
            markers.push(marker);
            marker.setMap(map);
            // 마커 이벤트리스너 등록
            kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
            kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        }
        bell_markers = markers; 
        clusterer.addMarkers(markers);
    });	    
} 


//-----------------------------------------------------------------------------
//------------------------------------------------------------------------경찰서

// 전국 경찰서, 지구대, 파출소 API
const policeApiKey ="DdC8tvJbN2Nkrf6SVd9ET4iq6Jx9wZJl%2Bjkuh5LW1rt3x45SAz1DR3k4Wky0SZEAovsAWIgb%2FWV20TNVs21QQA%3D%3D"
const policeUrl = 'https://api.odcloud.kr/api/15054711/v1/uddi:f038d752-ff35-4a22-a2c2-cf9b90de7a30?page=1&perPage=2264&serviceKey='+policeApiKey;
function getPolice(){
    
    //경찰서 이미지
    var imgSrc = 'assets/police.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40), 
        //마커 이미지의 옵션, 손가락 끝이 해당 좌표를 가리키도록 위치시켰습니다. 
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 

    // 지도에 경찰서 표시
    fetch(policeUrl)
    .then((res) => res.json())
    .then((resJson) => {
        var markers = [];
        var centers = resJson.data;
        for (var i = 0; i < centers.length; i++) { // 경찰서 좌표 가져오기
            //부산 정보만 가져옴
            if(centers[i]["청"] != "부산청") continue;
            var lat = centers[i]["Y좌표"];
            var lng = centers[i]["X좌표"];
            
            //마커의 이미지 정보
            var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                   markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                image: markerImage,
            });

            var infoWindow = new kakao.maps.InfoWindow({
                content: centers[i]["지구대파출소"], // 정보창에 경찰서 이름 표시
            });

            // 마커 추가
            markers.push(marker);
            
            
            // 마커 이벤트리스너 등록
            kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
            kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        }
        police_markers = markers;
        clusterer.addMarkers(markers);
    });
}


//-----------------------------------------------------------------------------
//------------------------------------------------------------------------소방서
function getfireStation(){
    /*서버가 필요한 호출
    //소방관 이미지
    var imgSrc = 'assets/firefighter.png', 
    //마커 이미지의 크기
    imgSize = new kakao.maps.Size(40, 40), 
    //마커 이미지의 옵션, 손가락 끝이 해당 좌표를 가리키도록 위치시켰습니다. 
    imgOption = {offset: new kakao.maps.Point(30, 10)}; 

        // [소방청] 시,도 소방서 현황 API
		const FSurl = "https://api.odcloud.kr/api/15048243/v1/uddi:818f12a7-70c1-4aff-81a0-80d5db5be9fb?page=1&perPage=224&serviceKey=Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D"
		
        // 지도에 소방서 표시
		fetch(FSurl)
			.then((res) => res.json())
			.then((resJson) => {
				// 마커표시에 사용할 변수 선언, api로 부터 받아온 Json은 Firestations 함수로 선언한다.
				var markers = [];
				var Firestations = resJson.data;
				

				// json으로부터 각 소방서의 data를 가져온다.
				for (var i = 0; i < Firestations.length; i++) {

					// 각 data에서 "주소" attribute의 value를 추출해 geocoder로 나온 검색결과를 function으로 받는다.
					var adress = Firestations[i]["주소"];
					geocoder.addressSearch(adress, function(result, status) {
						
						// 응답코드가 정상일 시
						if (status === kakao.maps.services.Status.OK) {

							// 위도와 경도값에 result의 좌표(y.x)를 각각 할당해 coords로 선언한다.
							var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                            //마커의 이미지 정보
                            var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                                markerPosition = new kakao.maps.LatLng(coords); // 마커가 표시될 위치입니다
							
                            // 마커의 속성 설정. 위치 값으로 coords를 넣는다.
							var marker = new kakao.maps.Marker({
								map: map,
								position: coords,
                                image: markerImage,
							});
								
							// 인포윈도우
							var infoWindow = new kakao.maps.InfoWindow({
								// "소방서" attribute의 value값을 추출하여 인포윈도우에 삽입한다.
								content: Firestations[i]["소방서"],
							});

							// 마커 추가
							markers.push(marker);
                            Firestation_markers = markers;
							
							// 마커 이벤트리스너 등록
							kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
							kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
						}
					}); 
				}
                Firestation_markers = markers; 
				clusterer.addMarkers(markers);
			});
            */
}
//-----------------------------------------------------------------------------
//------------------------------------------------------------------------가로등

// 전국보안등정보표준데이터 
const servKey = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D"
const instNm1 = "부산광역시%20남구청"
const instNm2 = "부산광역시%20수영구청"
const serchnumb = 1000
const SecureUrl = "http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api?serviceKey=" + servKey + "&pageNo=1&numOfRows=" + serchnumb + "&type=json&institutionNm="
 

function getLamp(){
    //가로등 이미지
    var imgSrc = 'assets/street-lamp.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(30, 30), 
        //마커 이미지의 옵션, 손가락 끝이 해당 좌표를 가리키도록 위치시켰습니다. 
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 
     
    // 지도에 보안등 표시1
		// 보안등 api의 url으로 호출
		fetch(SecureUrl + instNm1)
			.then((res) => res.json())
			.then((resJson) => {
				var markers = [];
				var items = resJson.response.body.items;
				for (var i = 0; i < items.length; i++) {
					var seclat = items[i].latitude;
                    var seclng = items[i].longitude;
					var coordinate = new kakao.maps.LatLng(seclat, seclng);
                    //마커의 이미지 정보
                    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(coordinate); // 마커가 표시될 위치입니다

					var marker = new kakao.maps.Marker({
						map: map,
						position: coordinate,
                        image: markerImage,
                    });
                    markers.push(marker);
                };
                clusterer.addMarkers(markers);
                lamp_markers = markers; 
            });



            fetch(SecureUrl + instNm2)
			.then((res) => res.json())
			.then((resJson) => {
				var markers = [];
				var items = resJson.response.body.items;
				for (var i = 0; i < items.length; i++) {
					var seclat = items[i].latitude;
                    var seclng = items[i].longitude;
					var coordinate = new kakao.maps.LatLng(seclat, seclng);
                    //마커의 이미지 정보
                    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(coordinate); // 마커가 표시될 위치입니다

					var marker = new kakao.maps.Marker({
						map: map,
						position: coordinate,
                        image: markerImage,
                    });
                    markers.push(marker);
                };
                clusterer.addMarkers(markers);
                lamp_markers = markers; 
            });
}






