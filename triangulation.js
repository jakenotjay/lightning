/*
C1 = {
    x : xpoint, (longitude)
    y : ypoint, (latitude)
    t = time
}

r1 = {
    x: xpoint, (km)
    y: ypoint, (km)
    t: time (same)
}
*/

function findSourcePoint(C1, C2, C3){
    var C0 = findTriangleCentre(C1, C2, C3);

    var r1 = convToKmCoords(C1, C0), r2 = convToKmCoords(C2, C0), r3 = convToKmCoords(C3, C0);

    dR21 = distanceDifference(r2, r1), dR31 = distanceDifference(r3, r1)

    
} 

// finds centre of circle
function findTriangleCentre(C1, C2, C3){
    var C0 = {
        x : null,
        y : null
    }

    C0.x = (C1.x + C2.x + C3.x) /3;
    C0.y = (C1.y + C2.y + C3.y) /3;

    return C0;
}

function convToKmCoords(C, O){
    var r = {
        x: null,
        y: null,
        t : C.t
    }

    r.x = haversineDistance(0, 0, C.x, O.x)
    r.y = haversineDistance(C.y, O.y, 0, 0)

    return r;
}

function haversineDistance(lat1, lat2, lon1, lon2) {
    var R = 6371e3;
    var latRad1 = lat1.toRadians();
    var latRad2 = lat2.toRadians();
    var dlatRad = (lat2-lat1).toRadians();
    var dlonRad = (lon2-lon1).toRadians();

    var a = Math.pow(Math.sin(dlatRad/2), 2) + (Math.cos(latRad1) * Math.cos(latRad2)) * Math.pow(Math.sin(dlonRad), 2);

    var d = 2 * R * Math.asin(a)
}

// finds delta D using speed of light and delta t
function distanceDifference(r2, r1){
    dt = r2.t - r1.t

    dr = dt * 3e8;
    return dr;

}