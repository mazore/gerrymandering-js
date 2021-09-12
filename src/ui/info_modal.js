export default function InfoModal(main) {
    this.main = main;
    this.overlay = document.getElementById('overlay');
    this.modal = document.querySelector('#info-modal');

    this.open = () => {
        this.modal.classList.add('active');
        this.overlay.classList.add('active');
    };
    this.open();

    this.close = () => {
        this.modal.classList.remove('active');
        this.overlay.classList.remove('active');
    };

    const closeButton = document.querySelector('.modal-header .close-button');
    closeButton.addEventListener('click', this.close);
    this.overlay.addEventListener('click', this.close);
}
