<?php
$helyes_jelszo = "Szekelyudvarhely_33"; 

if ($_POST['jelszo'] === $helyes_jelszo) {
    $fajl_neve = 'data.json';
    
    // Eddigi adatok beolvasása
    $jelenlegi_adatok = json_decode(file_get_contents($fajl_neve), true);
    if (!$jelenlegi_adatok) $jelenlegi_adatok = [];

    // Új poszt létrehozása
    $uj_poszt = array(
        "datum" => date("Y-m-d"),
        "kep" => htmlspecialchars($_POST['kep']),
        "szoveg" => htmlspecialchars($_POST['szoveg'])
    );

    // Új poszt hozzáadása a lista ELEJÉRE (hogy a legújabb legyen legfelül)
    array_unshift($jelenlegi_adatok, $uj_poszt);

    // Mentés a fájlba
    file_put_contents($fajl_neve, json_encode($jelenlegi_adatok));

    echo "<h3>Sikeres feltöltés!</h3><a href='aktualis.html'>Nézd meg a főoldalon</a> vagy <a href='admin.html'>Tölts fel újat</a>";
} else {
    echo "<h3>Hibás jelszó!</h3><a href='admin.html'>Vissza</a>";
}
?>