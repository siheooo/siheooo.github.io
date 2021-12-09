//-------------------------------------------------------------------------CCTV
var serviceKey_CCTV = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D";
var insttNm_CCTV1 = "부산광역시%20재난현장관리과"
var insttNm_CCTV2 = "부산광역시%20남구청"
// 남구청만 일단 추가했습니다.
// insttNm_CCTV3 = "부산광역시%20금정구청" 같이 새로 변수 만들어서 fetch하면 그 구역 CCTV도 나옵니다.

function getCCTV() {
    var CCTVImage = new kakao.maps.MarkerImage('assets/cctv.png', new kakao.maps.Size(40, 40));
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];
    fetch("https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_cctv_api?serviceKey=" + serviceKey_CCTV + "&numOfRows=100&type=json&institutionNm=" + insttNm_CCTV1)
        .then((res) => res.json())
        .then((resJson) => {
            var items = resJson.response.body.items;
            for (var i = 0; i < items.length; i++) {
                var markerPosition = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치입니다
                
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(items[i].latitude, items[i].longitude),
                    map: map,
                    image: CCTVImage,
                    clickable: true,
                });

                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">CCTV</div>',// 정보창에 이름 표시
                });
                
                //마커에 클릭 이벤트 등록
                kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));


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
                var markerPosition = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치입니다

                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(items[i].latitude, items[i].longitude),
                    map: map,
                    image: CCTVImage,
                    clickable: true,
                });
                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">CCTV</div>',// 정보창에 이름 표시
                });

                //마커에 클릭 이벤트 등록
                kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

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

  
    //비상벨 api
	const emergencyBellUrl = 'https://api.odcloud.kr/api/15036883/v1/uddi:d176e39b-b12c-4d80-bcc6-c828693bacb6_201910111559?page=1&perPage=80&serviceKey=' + serviceKey_emergencyBell;
	// 비상벨 api 지도에 표시
    var check = [];
	fetch(emergencyBellUrl)
		.then((res) => res.json())
		.then((resJson) => {
			var list = [];
			var bells = resJson.data;
			for (var i = 0; i < bells.length; i++) {
                list[i] = bells[i]["주        소"];
            }

            // promise 객체로 geocoder.addressSearch 함수를 호출
            const addressSearch = address => {
                return new Promise((resolve, reject) => {
                        geocoder.addressSearch(address, function(result, status) {
                            if (status === kakao.maps.services.Status.OK) {
                                resolve({"lat": result[0].y, "lng": result[0].x});
                            } else {
                                reject(status);
                            }
                        });
                });
            };

             // async-await
             (async () => {
                var markers = [];
                var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);
                for(const address of list) {
                    if(address == ""||address == null) continue;
                    const result = await addressSearch(address); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(result.lat, result.lng),
                        image: markerImage,
                        clickable: true,
                    });
                    // 마커에 클릭 이벤트 등록
                    // kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

                    // 마커 추가
                    markers.push(marker);
                    
                }
                bell_markers.push(markers);
                clusterer.addMarkers(markers);
        })();
    });
				

    //남구 안심귀갓길 api
	const Namgu_emergencyBellUrl = 'https://api.odcloud.kr/api/15060673/v1/uddi:8a1b0865-d795-44ff-8103-da53fea05140?page=1&perPage=20&serviceKey=' + serviceKey_emergencyBell;
	
    //남구 비상벨 지도에 표시
    fetch(Namgu_emergencyBellUrl)
    .then((res) => res.json())
    .then((resJson) => {
        var markers = []; 
        var check = [];
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
                image: markerImage,
                clickable: true,
            });
            //마커에 클릭 이벤트 등록
            kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

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
        bell_markers.push(markers);
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
        var check = [];
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
                clickable: true,
            });

            //마커에 클릭 이벤트 등록
            kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

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
				var Firestations = resJson.data;
                var list = [];

				// json으로부터 각 소방서의 data를 가져온다.
				for (var i = 0; i < Firestations.length; i++) {
					if(Firestations[i]["주소"].includes("부산") == false) continue;
					list[i] = Firestations[i]["주소"].substring(0, Firestations[i]["주소"].indexOf("("));;
				}
                
                // promise 객체로 geocoder.addressSearch 함수를 호출
                const addressSearch = address => {
                    return new Promise((resolve, reject) => {
                            geocoder.addressSearch(address, function(result, status) {
                                if (status === kakao.maps.services.Status.OK) {
                                    resolve({"lat": result[0].y, "lng": result[0].x});
                                } else {
                                    reject(status);
                                }
                            });
                    });
                };
                
                // async-await
                (async () => {
                        var markers = [];
                        var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption);
                        for(const address of list) {
                            if(address == ""||address == null) continue;
                            const result = await addressSearch(address); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                            var marker = new kakao.maps.Marker({
								map: map,
								position: new kakao.maps.LatLng(result.lat, result.lng),
                                image: markerImage,
                                clickable: true,
							});
                            // 마커에 클릭 이벤트 등록
                            // kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

							// 마커 추가
							markers.push(marker);
							
                        }
                        fireStation_markers = markers;
                        clusterer.addMarkers(markers);
                })();
                
			});
            
}

//-----------------------------------------------------------------------------
//------------------------------------------------------------------------가로등

// 전국보안등정보표준데이터 
const servKey = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D"
const instNm1 = "부산광역시%20남구청"
const instNm2 = "부산광역시%20수영구청"
const serchnumb = 1000
const SecureUrl = "https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api?serviceKey=" + servKey + "&pageNo=1&numOfRows=" + serchnumb + "&type=json&institutionNm="
 

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
                var check = [];
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
                        clickable: true,
                    });
                    //마커에 클릭 이벤트 등록
                    kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));


                    markers.push(marker);
                };
                clusterer.addMarkers(markers);
                lamp_markers.push(markers); 
            });


            fetch(SecureUrl + instNm2)
			.then((res) => res.json())
			.then((resJson) => {
				var markers = [];
                var check = [];
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
                        clickable: true,
                    });
                    //마커에 클릭 이벤트 등록
                    kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

                    markers.push(marker);
                };
                clusterer.addMarkers(markers);
                lamp_markers.push(markers);
            });
}






