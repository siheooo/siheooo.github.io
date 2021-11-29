// 사용하고자하는 지도 html 파일과 같은 폴더에 두시고 body에 아래 코드를 추가하시면 됩니다.
// <script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx7b7144d6b822440c89d5008ebeb3fd17"></script>
// <script src="pedestrian_route.js"></script>

// person_route(출발지, 도착지, 지도 객체) 형식으로 호출하면 됩니다.
// 출발지 도착지는 카카오맵 객체를 사용합니다.
// ex) var start = new kakao.maps.LatLng(35.13367784973298, 129.1049204111099);

function pedestrian_route(s, e, m) {

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
        body: JSON.stringify({
            "startX": s.getLng(),
            "startY": s.getLat(),
            "endX": e.getLng(),
            "endY": e.getLat(),
            "reqCoordType": "WGS84GEO",
            "resCoordType": "WGS84GEO",
            "startName": "출발지",
            "endName": "도착지"
        })
    })
    // post 호출 후 결과값을 받아옴
        .then(res => res.json())
        .then(resJson => {
            var linePath = [];
            var features = resJson.features

            // 거리, 시간 출력
            var tDistance = "총 거리 : " + ((features[0].properties.totalDistance) / 1000).toFixed(1) + "km,";
            var tTime = " 총 시간 : " + ((features[0].properties.totalTime) / 60).toFixed(0) + "분";
            //id = result에 tDistance + tTime 출력
            try {
                document.getElementById("result").innerHTML = tDistance + tTime;
            }
            catch (err) {
                console.log(err);
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
            var polyline = new kakao.maps.Polyline({ // 선 그리기 옵션
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