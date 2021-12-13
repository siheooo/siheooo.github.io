//-------------------------------------------------------------------------CCTV
var serviceKey_CCTV = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D";
var insttNm_CCTV1 = "부산광역시%20재난현장관리과"
var insttNm_CCTV2 = "부산광역시%20남구청"
// 남구청만 일단 추가했습니다.
// insttNm_CCTV3 = "부산광역시%20금정구청" 같이 새로 변수 만들어서 fetch하면 그 구역 CCTV도 나옵니다.

function getCCTV() {
    display_loading()
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
            vanish_loading();
        })
}

//-----------------------------------------------------------------------------
//------------------------------------------------------------------------비상벨

function getEmergencyBell(){
    display_loading()
    var markers = [];
    var serviceKey_emergencyBell = 'i0omZLilsWQxFd3kY5EnR0GjiK1v%2BbymoppTqZykRtT9hRyM4QCxVyW4gcV%2BczyPKQSAH17efFCAbzELgv0wDA%3D%3D';
		//비상벨 url
		var emergencyBellUrl = 'https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_safety_emergency_bell_position_api?serviceKey=' + serviceKey_emergencyBell+ '&numOfRows=30&type=xml&instt_code='; 

    //부산시 내 비상벨 코드
    var instt_code = [
        '3310000', //남구
        '3320000', //북구
        '3350000',
        '3360000',
        '3370000',
    ];

    //비상벨 이미지
    var imgSrc = 'assets/emergencyBell.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40), 
        //마커 이미지의 옵션, 손가락 끝이 해당 좌표를 가리키도록 위치시켰습니다. 
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 
        
  
   // 비상벨 api 지도에 표시
    var check = [];

    for(var i = 0; i < instt_code.length; i++){
        //xml 타입 api 요청하기 
        const xhr = new XMLHttpRequest();
        xhr.open('GET', emergencyBellUrl + instt_code[i]);

        xhr.send();

    xhr.onreadystatechange = function() {
            //문제가 없으면
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    
                    var xml = xhr.responseXML;
                    
                    //위도
                    var latitudes = xml.getElementsByTagName("latitude");
                    //경도
                    var longitudes = xml.getElementsByTagName("longitude");
                    //마커의 이미지 정보
                    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치
                    
                    for (var i = 0; i < latitudes.length; i++) {
                        var lat = latitudes[i].childNodes[0].nodeValue;
                        var lng = longitudes[i].childNodes[0].nodeValue;
                        var coordinate = new kakao.maps.LatLng(lat, lng);

                        console.log(lat + " " + lng);
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
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
                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                        
                        bell_markers = markers;
                        clusterer.addMarkers(markers);
                        vanish_loading()
                    }

                } else {
                    alert(request.status);
                    vanish_loading();

            }
            }
        }
    }
} 


//-----------------------------------------------------------------------------
//------------------------------------------------------------------------경찰서

// 전국 경찰서, 지구대, 파출소 API
const policeApiKey ="DdC8tvJbN2Nkrf6SVd9ET4iq6Jx9wZJl%2Bjkuh5LW1rt3x45SAz1DR3k4Wky0SZEAovsAWIgb%2FWV20TNVs21QQA%3D%3D"
const policeUrl = 'https://api.odcloud.kr/api/15054711/v1/uddi:f038d752-ff35-4a22-a2c2-cf9b90de7a30?page=1&perPage=2264&serviceKey='+policeApiKey;
function getPolice(){
    display_loading()
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
        vanish_loading();
    });
}


//-----------------------------------------------------------------------------
//------------------------------------------------------------------------소방서
function getfireStation(){
    display_loading()
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
                        vanish_loading();
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
    display_loading()
    var markers = [];
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
            });


            fetch(SecureUrl + instNm2)
			.then((res) => res.json())
			.then((resJson) => {
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
            });
            
            clusterer.addMarkers(markers);
            lamp_markers = markers; 
            vanish_loading();
}


//-----------------------------------------------------------------------------
//------------------------------------------------------------------------편의점

function getConvenience(){
    display_loading()
    //요청 변수로 넣을 검색 키워드
    const queryValue = 
    ["부산%20기장군%20편의점", 
    "부산%20금정구%20편의점",
    "부산%20해운대구%20편의점",
    "부산%20동래구%20편의점",
    "부산%20연제구%20편의점",
    "부산%20북구%20편의점",
    "부산%20수영구%20편의점",
    "부산%20부산진구%20편의점",
    "부산%20동구%20편의점",
    "부산%20서구%20편의점",
    "부산%20중구%20편의점",
    "부산%20영도구%20편의점",
    "부산%20사상구%20편의점",
    "부산%20사하구%20편의점",
    "부산%20강서구%20편의점",
    "부산%20남구%20편의점",];
    //이미지
    var imgSrc = 'assets/shop.png', 
    //마커 이미지의 크기
    imgSize = new kakao.maps.Size(30, 30);

    
    var markers = [];

    //구 마다 24시간 영업 가게 받아오기
    for (var j = 0; j < queryValue.length; j++){

        const Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[j] + '&display=5';
        const option = {
            headers: {
                'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
                'X-Naver-Client-Secret': 'XKCwNmbKPv',
            },
        };


        fetch(Url, option)
            .then((res) => res.json())
            .then((resJson) => {
                var items = resJson.items;
                var markers = [];
                //주소를 저장할 배열
                var addressList = [];
                //가게명을 저장할 배열
                var titleList = [];

                //주소와 가게명 받기
                for (var i = 0; i < items.length; i++) {
                    addressList[i]=items[i].address;
                    titleList[i]=items[i].title;
                }

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
                    
                    for(var i = 0; i < addressList.length; i++) {
                        if(addressList[i] == ""||addressList[i] == null) continue;
                        const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                        //마커의 이미지 정보
                        var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize);
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: new kakao.maps.LatLng(result.lat, result.lng),
                            clickable: true,
                            image: markerImage,
                        });
                        var infoWindow = new kakao.maps.InfoWindow({
                            content: titleList[i],// 정보창에 이름 표시
                        });


                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
            
                        // 마커에 클릭 이벤트 등록
                        // kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

                        // 마커 추가
                        markers.push(marker);
                        
                    }
            })();
        });
                    convenience_markers = markers;
                    clusterer.addMarkers(markers);
                    vanish_loading();
    }
}

//-----------------------------------------------------------------------------
//------------------------------------------------------------------------24시간

function getShop24hr(){
    display_loading()
    //요청 변수로 넣을 검색 키워드
    const queryValue = 
    ["부산%20기장군%2024시", 
    "부산%20금정구%2024시",
    "부산%20해운대구%2024시",
    "부산%20동래구%2024시",
    "부산%20연제구%2024시",
    "부산%20북구%2024시",
    "부산%20수영구%2024시",
    "부산%20부산진구%2024시",
    "부산%20동구%2024시",
    "부산%20서구%2024시",
    "부산%20중구%2024시",
    "부산%20영도구%2024시",
    "부산%20사상구%2024시",
    "부산%20사하구%2024시",
    "부산%20강서구%2024시",
    "부산%20남구%2024시",];
    var imgSrc = 'assets/24-hours.png', 
    //마커 이미지의 크기
    imgSize = new kakao.maps.Size(30, 30);
    var markers = [];

    //구 마다 24시간 영업 가게 받아오기
    for (var j = 0; j < queryValue.length; j++){

        const Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[j] + '&display=5';
        const option = {
            headers: {
                'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
                'X-Naver-Client-Secret': 'XKCwNmbKPv',
            },
        };


        fetch(Url, option)
            .then((res) => res.json())
            .then((resJson) => {
                var items = resJson.items;
                var markers = [];
                //주소를 저장할 배열
                var addressList = [];
                //가게명을 저장할 배열
                var titleList = [];

                //주소와 가게명 받기
                for (var i = 0; i < items.length; i++) {
                    addressList[i]=items[i].address;
                    titleList[i]=items[i].title;
                }

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
                    
                    for(var i = 0; i < addressList.length; i++) {
                        if(addressList[i] == ""||addressList[i] == null) continue;
                        const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                        //마커의 이미지 정보
		    		    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize);
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: new kakao.maps.LatLng(result.lat, result.lng),
                            clickable: true,
                            image: markerImage,
                        });
                        var infoWindow = new kakao.maps.InfoWindow({
                            content: titleList[i],// 정보창에 이름 표시
                        });


                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
            
                        // 마커에 클릭 이벤트 등록
                        // kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

                        // 마커 추가
                        markers.push(marker);
                        
                    }
            })();
            });  
        shop24hr_markers = markers;
        clusterer.addMarkers(markers);
        vanish_loading();
    }
        
}

//-----------------------------------------------------------------------------
//------------------------------------------------------------------------응급실

function getEmergencyRoom(){
    display_loading()
    var markers = [];
    var serviceKey_emergencyRoom = 'i0omZLilsWQxFd3kY5EnR0GjiK1v%2BbymoppTqZykRtT9hRyM4QCxVyW4gcV%2BczyPKQSAH17efFCAbzELgv0wDA%3D%3D';
	//응급실 url
    var emergencyRoomUrl = 'https://cors-jhs.herokuapp.com/http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire?serviceKey=' + serviceKey_emergencyRoom + '&pageNo=15&numOfRows=1000'; 
		

    //응급실 이미지
    var imgSrc = 'assets/ambulance.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40), 
        //마커 이미지의 옵션
        imgOption = {offset: new kakao.maps.Point(30, 10)}; 
        
  
    
    var check = [];

        //xml 타입 api 요청하기 
        const xhr = new XMLHttpRequest();
        xhr.open('GET', emergencyRoomUrl);

        xhr.send();

    xhr.onreadystatechange = function() {
            //문제가 없으면
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    
                    var xml = xhr.responseXML;
                    
                    //위도
					var latitudes = xml.getElementsByTagName("wgs84Lat");
					//경도
					var longitudes = xml.getElementsByTagName("wgs84Lon");
                    //기관명
                    var dutyNames = xml.getElementsByTagName("dutyName");
                    //응급실 운영 여부
                    var dutyEryns = xml.getElementsByTagName("dutyEryn");

                    //마커의 이미지 정보
                    var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                    markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치
                    
                    for (var i = 0; i < latitudes.length; i++) {
                        var lat = latitudes[i].childNodes[0].nodeValue;
                        var lng = longitudes[i].childNodes[0].nodeValue;
                        var coordinate = new kakao.maps.LatLng(lat, lng);

                        var name = dutyNames[i].childNodes[0].nodeValue;
                        var dutyEryn = dutyEryns[i].childNodes[0].nodeValue;

                        if (dutyEryn != 1) continue;
                        
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
                            image: markerImage,
                            clickable: true,
                        });
                        //마커에 클릭 이벤트 등록
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));
            
                        var infoWindow = new kakao.maps.InfoWindow({
                            content: '<div style="width:150px;text-align:center;padding:6px 0;">'+ name +'</div>',// 정보창에 이름 표시
                        });
            
                        // 마커 추가
                        markers.push(marker);
                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                        
                        ER_markers = markers;
                        clusterer.addMarkers(markers);
                        vanish_loading()
                    }

                } else {
                    alert(request.status);
                    vanish_loading()

            }
            }
        }
} 
