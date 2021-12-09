// 사용하고자하는 지도 html 파일과 같은 폴더에 두시고 body에 아래 코드를 추가하시면 됩니다.
// <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx7b7144d6b822440c89d5008ebeb3fd17"></script>
// <script src="pedestrian_route.js"></script>

// person_route(출발지, 도착지, 지도 객체) 형식으로 호출하면 됩니다.
// 출발지 도착지는 카카오맵 객체를 사용합니다.
// ex) var start = new kakao.maps.LatLng(35.13367784973298, 129.1049204111099);

function pedestrian_route(s, e, m) {

    // ----경유지 구현 추가된 부분------
    // 기존 경로가 있다면 지우기
    if (polyline != null) {
        polyline.setMap(null);
    }

    if (passList.length == 0) {
        var request = JSON.stringify({
            "startX": s.getLng(),
            "startY": s.getLat(),
            "endX": e.getLng(),
            "endY": e.getLat(),
            "reqCoordType": "WGS84GEO",
            "resCoordType": "WGS84GEO",
            "startName": "출발지",
            "endName": "도착지"
        });
    } else {
        var request = JSON.stringify({
            "startX": s.getLng(),
            "startY": s.getLat(),
            "endX": e.getLng(),
            "endY": e.getLat(),
            "passList": passListString,
            "reqCoordType": "WGS84GEO",
            "resCoordType": "WGS84GEO",
            "startName": "출발지",
            "endName": "도착지"
        })
    }
    // ----경유지 구현 추가된 부분------

    // 출발지, 도착지 마커 표시 
    var startMarker = new kakao.maps.Marker({
        map: m,
        position: s
    });
    var endMarker = new kakao.maps.Marker({
        map: m,
        position: e
    });
    //인포윈도우로 출발지, 도착지 정보 표시
    var startInfoWindow = new kakao.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:6px 0;">출발지</div>'
    });
    var endInfoWindow = new kakao.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:6px 0;">도착지</div>'
    });
    kakao.maps.event.addListener(startMarker, 'mouseover', function () {
        startInfoWindow.open(m, startMarker);
    });
    kakao.maps.event.addListener(startMarker, 'mouseout', function () {
        startInfoWindow.close(m, startMarker);
    });
    kakao.maps.event.addListener(endMarker, 'mouseover', function () {
        endInfoWindow.open(m, endMarker);
    });
    kakao.maps.event.addListener(endMarker, 'mouseout', function () {
        endInfoWindow.close(m, endMarker);
    });
    
    // fetch를 통해 길찾기 api 호출
    fetch("https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "appKey": "l7xx7b7144d6b822440c89d5008ebeb3fd17"
        },
        body: request
    })
    // post 호출 후 결과값을 받아옴
        .then(res => res.json())
        .then(resJson => {
            var linePath = [];
            var features = resJson.features
            var tDistance = ((features[0].properties.totalDistance) / 1000).toFixed(2);
            var tTime = ((features[0].properties.totalTime) / 60).toFixed(0);
            // 거리, 시간 계산
            
            if(passList.length == 0){
            distance = tDistance;
            time = tTime;
            console.log( "기존 경로입니다. "+ distance+"km, " + time+"분");
            // id = "default_route"인 요소의 내용을 변경
            document.getElementById("default_route").innerHTML = "기존 경로: "+ distance+"km, " + time+"분";
            document.getElementById("optional_route").innerHTML = "추가 경로: 없음";
            }else{
                distance_pass = tDistance;1
                time_pass = tTime;
                console.log("추가 거리: " +(distance_pass - distance).toFixed(2)+ "km, 추가 시간: " + (time_pass - time)+ "분");
                document.getElementById("optional_route").innerHTML = "추가 경로: "+ (distance_pass - distance).toFixed(2)+"km, " + (time_pass - time)+ "분";
            }
            

            // 경로 좌표 받아오기
            for (var i in features) {
                var geometry = features[i].geometry
                if (geometry.type == "LineString") {
                    for (var j in geometry.coordinates) {
                        var latLng = new kakao.maps.LatLng(geometry.coordinates[j][1], geometry.coordinates[j][0]);
                        linePath.push(latLng);
                    }
                }
            }
            polyline = new kakao.maps.Polyline({ // 선 그리기 옵션
                path: linePath,
                strokeWeight: 5,
                strokeColor: 'blue',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });
            polyline.setMap(m); // 선그리기

            // 지도 중심좌표 변경
            var bounds = new kakao.maps.LatLngBounds();
            bounds.extend(s);
            bounds.extend(e);
            m.setBounds(bounds);

        });
}
