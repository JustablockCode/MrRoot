document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9.]/g, '');

        let periodCount = (this.value.match(/\./g) || []).length;
        if (periodCount > 1) {
            this.value = this.value.replace(/\.+$/, '');
        }
        
        if (this.value.length > 3) {//+
            this.value = this.value.slice(0, 3);//+
        }//
    });
});

