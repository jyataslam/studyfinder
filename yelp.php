
<?php
$proxyURL = "https://api.yelp.com/v3/businesses/search?location=". $_GET['location'];
$api_key = 'Authorization: Bearer ' . $_GET['apikey'];

header("Access-Control-Allow-Origin: *");

$headers = apache_request_headers();

$curl = curl_init();

if (isset($_GET['term'])) {
  $proxyURL = "$proxyURL&term=".$_GET['term'];
}

curl_setopt_array($curl, array(
    CURLOPT_URL => $proxyURL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_SSL_VERIFYHOST => 0,
    CURLOPT_SSL_VERIFYPEER => 0,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
        $api_key
    )
));

$response = curl_exec($curl);
$err = curl_error($curl);
echo $err;
echo $response;
?>