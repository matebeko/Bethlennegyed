<?php
// --- Settings ---
$jelszo = "refudvar"; 
$cel_mappa = "kepek/public_html/weblap"; 

// Message
$uzenet = "";
$feltoltott_link = "";

// IF form is sent
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['jelszo'] !== $jelszo) {
        $uzenet = "<p style='color:red;'>Hibás jelszó!</p>";
    } else {
        // Ellenőrizzük, hogy van-e fájl és nincs-e hiba
        if (isset($_FILES['kep']) && $_FILES['kep']['error'] == 0) {
            $fajl_nev = basename($_FILES['kep']['name']);
            // Eltávolítjuk a szóközöket és ékezeteket a fájlnévből a biztonság kedvéért
            $tisztitott_nev = preg_replace("/[^a-zA-Z0-9.]/", "_", $fajl_nev);
            // Egyedi nevet adunk neki, hogy ne írják felül egymást (pl. 16789123_plakat.jpg)
            $vegleges_nev = time() . "_" . $tisztitott_nev;
            $cel_utvonal = $cel_mappa . $vegleges_nev;

            // Csak képeket engedünk feltölteni
            $fajl_tipus = mime_content_type($_FILES['kep']['tmp_name']);
            if (strpos($fajl_tipus, "image/") === 0) {
                if (move_uploaded_file($_FILES['kep']['tmp_name'], $cel_utvonal)) {
                    // Sikeres feltöltés, generáljuk a linket
                    $weboldal_cime = "https://" . $_SERVER['HTTP_HOST'] . "/";
                    $feltoltott_link = $weboldal_cime . $cel_utvonal;
                    $uzenet = "<p style='color:green;'>Sikeres feltöltés!</p>";
                } else {
                    $uzenet = "<p style='color:red;'>Hiba történt a fájl mentésekor.</p>";
                }
            } else {
                $uzenet = "<p style='color:red;'>Csak képformátumot (JPG, PNG) lehet feltölteni!</p>";
            }
        } else {
            $uzenet = "<p style='color:red;'>Kérlek válassz ki egy képet!</p>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hír feltöltése</title>
    <style>
        body { font-family: sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h2 { color: #644400; text-align: center; }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        input[type="password"], input[type="file"] { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
        button { width: 100%; padding: 12px; background-color: #C3975D; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold;}
        button:hover { background-color: #644400; }
        .result { margin-top: 20px; padding: 15px; background: #e8d5b7; border-radius: 4px; border-left: 4px solid #644400;}
        .result input { width: 100%; padding: 8px; margin-top: 10px; border: 1px solid #ccc; box-sizing: border-box; }
    </style>
</head>
<body>

<div class="container">
    <h2>Képfeltöltés a Hírekhez</h2>
    
    <?php echo $uzenet; ?>

    <?php if($feltoltott_link): ?>
        <div class="result">
            <strong>Sikeresen feltöltve!</strong><br>
            Másold ki az alábbi linket, és illeszd be a Google Táblázat "KépURL" oszlopába:
            <input type="text" value="<?php echo $feltoltott_link; ?>" readonly onclick="this.select();">
        </div>
    <?php endif; ?>

    <form method="POST" enctype="multipart/form-data">
        <label for="jelszo">Titkos jelszó:</label>
        <input type="password" name="jelszo" id="jelszo" required>

        <label for="kep">Kép kiválasztása (JPG, PNG):</label>
        <input type="file" name="kep" id="kep" accept="image/*" required>

        <button type="submit">Kép Feltöltése</button>
    </form>
</div>

</body>
</html>