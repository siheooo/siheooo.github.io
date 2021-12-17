
// 경로 안내와 관련된 스크립트를 작성하였습니다.

// 출발지 마커, 도착지 마커, 경로를 전역 변수로 선언
var startMarker;
var endMarker;
var polyline;

// 보행자 경로를 받아와 지도에 출력하는 함수
function pedestrian_route(s, e, m) {

    // 기존 경로가 있다면 지우기
    if (polyline != null) {
        polyline.setMap(null);
    }
    // 기존 도착지가 있다면 지우기
    if (startMarker != null) {
        startMarker.setMap(null);
    }
    // 기존 출발지가 있다면 지우기
    if (endMarker != null) {
        endMarker.setMap(null);
    }
    
    // 경유지가 없을때 request
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
        // 경유지가 있을때 request
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

    // 출발지, 도착지 마커 지도에 표시 
    startMarker = new kakao.maps.Marker({
        map: m,
        position: s
    });
    endMarker = new kakao.maps.Marker({
        map: m,
        position: e
    });

    // 인포윈도우로 출발지, 도착지 정보 표시
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
            // 경유지가 없을 경우
            if (passList.length == 0) {
                distance = tDistance;
                time = tTime;
                console.log("기존 경로입니다. " + distance + "km, " + time + "분");
                // id = "default_route"인 요소의 내용을 변경
                document.getElementById("default_route").innerHTML = "기존 경로: " + distance + "km, " + time + "분";
                document.getElementById("optional_route").innerHTML = "추가 경로: 없음";
            }
            // 경유지가 있을 경우 
            else {
                distance_pass = tDistance; 1
                time_pass = tTime;
                console.log("추가 거리: " + (distance_pass - distance).toFixed(2) + "km, 추가 시간: " + (time_pass - time) + "분");
                document.getElementById("optional_route").innerHTML = "추가 경로: " + (distance_pass - distance).toFixed(2) + "km, " + (time_pass - time) + "분";
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

            // 선 그리기 옵션
            polyline = new kakao.maps.Polyline({ 
                path: linePath,
                strokeWeight: 5,
                strokeColor: 'blue',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });

            // 선그리기
            polyline.setMap(m); 

            // 지도 중심좌표 변경
            var bounds = new kakao.maps.LatLngBounds();
            
            // 경유지 선택 중일 땐 중심 좌표가 안바뀌도록
            if(passList.length == 0){
                bounds.extend(s);
                bounds.extend(e);
                m.setBounds(bounds);
            }

        });
}

// 경유지 추가, 삭제 함수
function setWaypoint(check, i, markerPosition, marker) {

    // 1. 선택된 마커가 이미 경유지인 경우 선택 취소
    if(check[i]) {
        check[i] = false;
        // passList 에서 markerPosition 과 같은 값을 찾아서 삭제
        for(var j = 0; j < passList.length; j++) {
            if(passList[j] == markerPosition) {
                passList.splice(j, 1);
                break;
            }
        }
        
        // 선택된 마커와 좌표가 같은 경유지 표시 마커가 있다면 삭제
        // (경유지 마커가 아닌 시설물 마커를 눌러 경유지를 삭제하는 경우에 해당)
        for(var j = 0; j < waypoint_marker.length; j++) {
            // 소수점 7자리 이후로 시설물과 경유지 마커의 경도 좌표가 미세하게 다른 문제 발생
            // waypoint_marker의 경도 좌표에서 소수점 7자리까지만 사용하여 비교
            if(waypoint_marker[j].getPosition().getLat() == markerPosition.getLat() 
                && waypoint_marker[j].getPosition().getLng().toFixed(7) == markerPosition.getLng()) {
                deleteWaypointMarker(waypoint_marker[j]);
                break;
            }
        }

        setWaypointToString();
        pedestrian_route(start, end, map);
        return ;
    }
    // 2. 5개 이상의 경유지는 선택 불가
    if(passList.length == 5){
        alert("마커를 5개 이상 선택하였습니다.");
        return ;
    }
    // 3. 선택된 마커가 경유지가 아닌 경우 경유지로 추가
    else {
        check[i] = true;
        passList.push(markerPosition);
        insertWayPointMarker(check, i, markerPosition ,marker);
        setWaypointToString();
        pedestrian_route(start, end, map);
    }
}

// 경유지 마커 삽입 함수
function insertWayPointMarker(check, i, markerPosition, original_marker) {
    var marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        image: waypoint_markerImage[passList.length],
        clickable: true
    });
    waypoint_marker.push(marker);
    // 경유지 마커 클릭시 삭제
    kakao.maps.event.addListener(marker, 'click', function () {
        deleteWaypointMarker(marker);
        setWaypoint(check, i, markerPosition, original_marker);
    });
}

// 경유지 마커 삭제 함수
function deleteWaypointMarker(marker) {
    marker.setMap(null);
    var i = waypoint_marker.indexOf(marker);
    waypoint_marker.splice(i, 1);
    //해당 marker 뒤 경유지 마커들 이미지 순서 변경
    for (var j = i; j < waypoint_marker.length; j++) {
        waypoint_marker[j].setImage(waypoint_markerImage[++i]);
    }
}

// PassList 를 문자열로 변환하여 전역변수 passListString에 저장하는 함수
function setWaypointToString() {
    // passList의 경도, 위도는 "," 각 좌표끼리는 _로 구분하여 string으로 변환
    passListString = "";
    for (var i = 0; i < passList.length; i++) {
        passListString += passList[i].La + "," + passList[i].Ma + "_";
    }
    passListString = passListString.substring(0, passListString.length - 1);
}

//마커 클릭 이벤트 리스너, 경유지 선택에 사용
function mouseClickListener(check, i, markerPosition, marker){
    return function(){
        setWaypoint(check, i, markerPosition, marker);
    };
}

