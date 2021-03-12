import ps from '../parameters.js';

export default function StopButton(main) {
    this.shown = false;
    const element = document.getElementById('stopButton');
    element.onclick = () => {
        ps.defaultTargetNumBlueDistricts(main.simulation);
    };

    this.show = () => {
        if (!this.shown) {
            element.style.visibility = 'visible';
            this.shown = true;
        }
    };

    this.hide = () => {
        if (this.shown) {
            element.style.visibility = 'hidden';
            this.shown = false;
        }
    };
}
