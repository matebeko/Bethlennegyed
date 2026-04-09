document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-navigation');

    menuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        
        // Change icon from hamburger (☰) to close (✕) when opened
        if (mainNav.classList.contains('show')) {
            menuBtn.innerHTML = '✕';
        } else {
            menuBtn.innerHTML = '☰';
        }
    });

    // Post loading of new items
    const hirekTarolo = document.getElementById('hirek-tarolo');
    
    if (hirekTarolo) {
        const TABLAZAT_ID = '1tgiwaOBXxuGPuZPUyWuO8_5UArjbXBOFNMyxFnRmAYA'; 
        
        const url = `https://docs.google.com/spreadsheets/d/${TABLAZAT_ID}/gviz/tq?tqx=out:json`;

        fetch(url)
            .then(res => res.text())
            .then(text => {
                const data = JSON.parse(text.substr(47).slice(0, -2));
                const rows = data.table.rows;
                
                hirekTarolo.innerHTML = ''; // "Betöltés folyamatban..." 

                // Végigmegyünk a táblázat sorain (a legújabbak felülre kerülnek, ha visszafelé olvassuk)
                for (let i = rows.length - 1; i >= 0; i--) {
                    const row = rows[i];
                    
                    // Ha a sor teljesen üres, ugorjuk át
                    if (!row || !row.c || !row.c[0]) continue; 

                    // Oszlopok beolvasása (A: Dátum, B: KépURL, C: Szöveg)
                    const datum = row.c[0] ? row.c[0].v : '';
                    const kepUrl = row.c[1] ? row.c[1].v : null; 
                    const szoveg = row.c[2] ? row.c[2].v : '';

                    // HTML kártya felépítése
                    let html = `<article class="event-card">`;
                    
                    if (kepUrl) {
                        html += `<img src="${kepUrl}" alt="Hírhez tartozó kép">`;
                    }
                    
                    if (szoveg) {
                        html += `
                            <p class="event-caption" style="margin-top: 15px;">
                                <strong>${szoveg}</strong>
                            </p>`;
                    }

                    html += `
                    </article>
                    <hr style="width: 50%; margin: 30px auto; border: 1px solid #eee;">
                    `;
                    
                    hirekTarolo.innerHTML += html;
                }
            })
            .catch(error => {
                console.error('Hiba történt a hírek beolvasásakor:', error);
                hirekTarolo.innerHTML = '<p style="text-align: center; color: red;">Jelenleg nem sikerült betölteni a híreket.</p>';
            });
    }
});