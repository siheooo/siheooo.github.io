// 사이드바 on, off
function sidebar_wrap_on() {
    var sidebar_wrap = document.getElementById("sidebar_wrap");
    sidebar_wrap.style.display = "block";
}
function sidebar_wrap_off() {
    var sidebar_wrap = document.getElementById("sidebar_wrap");
    sidebar_wrap.style.display = "none";
}

// 지도 확대, 축소
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

// 현재 위치 불러오기
function current_location() {
    // 기존 현재위치 마커 지우기
    if (current_location_marker != null) {
        map.removeOverlayMapObject(current_location_marker);
    }
    // 현재 위치 불러오기
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var latlng = new kakao.maps.LatLng(lat, lng);

        //gps 이미지
        var imgSrc = 'assets/gps.png', 
            //마커 이미지의 크기
            imgSize = new kakao.maps.Size(40, 42), 
            imgOption = {offset: new kakao.maps.Point(30, 10)};

        //마커의 이미지 정보
        var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
            markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

        var marker = new kakao.maps.Marker({
            position: latlng,
            image: markerImage,
        });
        marker.setMap(map);
        current_location_marker = marker;
        map.setCenter(latlng);
    });
}

// 사이렌 소리 toggle
function siren() {
    var siren = document.getElementById("siren");
    if (siren.paused) {
        siren.currentTime = 0;
        siren.play();
    } else {
        siren.pause();
    }
}

// 전화벨 소리
function call() {
    location.href = "tel:112";
}

    // buttons.js에 추가
    // 전화걸기
    function call() {
        location.href = "tel:" + document.getElementById("callnumb").value;

    }
    // 문자 보내기
    function sms() {
        location.href = "tel:" + document.getElementById("callnumb").value;
        location.href = 'sms:' + document.getElementById("smsnumb").value + '?body=' + document.getElementById("smscont").value
    }

// 사이드바 open
function openSidebar() {
    document.getElementById("sidebar").style.width = "70px";
    var subSidebar = document.getElementsByClassName("subSidebar");
    for (var i = 0; i < subSidebar.length; i++) {
        document.getElementsByClassName("subSidebar")[i].style.width = "0px";
    }
}

// 사이드바 전체 닫기
function closeSidebar() {
    var isSubSidebarOpen = false;

    var subSidebar = document.getElementsByClassName("subSidebar");
    for (var i = 0; i < subSidebar.length; i++) {
        if (subSidebar[i].style.width != ("0px")) isSubSidebarOpen = true;
    }

    console.log(isSubSidebarOpen);

    closeSubSidebar();

    if (isSubSidebarOpen) {
        setTimeout(function () {
            document.getElementById("sidebar").style.width = "0";
        }, 500);
    }
    else {
        document.getElementById("sidebar").style.width = "0";
    }
}

// 서브 사이드바 toggle
function openSubSidebar(num) {
    closeSubSidebar();
    document.getElementById("subSidebar_"+num).style.width = "300px";
    document.getElementById("subSidebar_"+num).style.border = "1px solid #919191";
}

// 서브 사이드바 전체 닫기
function closeSubSidebar() {
    for(var i = 1; i < 4; i++) {
        document.getElementById("subSidebar_"+i).style.width = "0";
        document.getElementById("subSidebar_"+i).style.border = "none";
    }
}

//체크박스 함수
function checkBox(obj) {
    var result = obj.value;
    if (obj.checked) {
        switch (result) {
            case "CCTV":
                getCCTV();
                break;
            case "BELL":
                getEmergencyBell();
                break;
            case "POLICE":
                getPolice();
                break;
            case "FIRE":
                getfireStation();
                break;
            case "LAMP":
                getLamp();
                break;
        }
    } else {
        switch (result) {
            case "CCTV":
                for (var i = 0; i < CCTV_markers.length; i++) {
                    clusterer.removeMarker(CCTV_markers[i]);
                }
                break;
            case "BELL":
                for (var i = 0; i < bell_markers.length; i++) {
                    clusterer.removeMarker(bell_markers[i]);
                }
                break;
            case "POLICE":
                for (var i = 0; i < police_markers.length; i++) {
                    clusterer.removeMarker(police_markers[i]);
                }
                break;
            case "FIRE":
                for (var i = 0; i < fireStation_markers.length; i++) {
                    clusterer.removeMarker(fireStation_markers[i]);
                }
                break;
            case "LAMP":
                for (var i = 0; i < lamp_markers.length; i++) {
                    clusterer.removeMarker(lamp_markers[i]);
                }
                break;
        }
    }
}
