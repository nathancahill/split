
function calcParts(expr) {
    var re = /calc\(([\d]*\.[\d]*)%\s-\s([\d]+)px\)/,
        m = re.exec(expr);

    return {
        percentage: parseFloat(m[1]),
        pixels: parseInt(m[2])
    };
}

describe('Split', function() {
    beforeEach(function() {
        this.a = document.createElement('div');
        this.b = document.createElement('div');
        this.c = document.createElement('div');

        this.a.id = 'a';
        this.b.id = 'b';
        this.c.id = 'c';

        document.body.appendChild(this.a)
        document.body.appendChild(this.b);
        document.body.appendChild(this.c);
    });

    afterEach(function() {
        document.body.removeChild(this.a);
        document.body.removeChild(this.b);
        document.body.removeChild(this.c);
    });

    it('splits in two when given two elements', function() {
        Split(['a', 'b']);

        expect(this.a.style.width).toBe('calc(50% - 5px)');
        expect(this.b.style.width).toBe('calc(50% - 5px)');
    });

    it('splits in three when given three elements', function() {
        Split(['a', 'b', 'c']);

        expect(calcParts(this.a.style.width).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.b.style.width).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.c.style.width).percentage).toBeCloseTo(33.33);

        expect(calcParts(this.a.style.width).pixels).toBe(5);
        expect(calcParts(this.b.style.width).pixels).toBe(10);
        expect(calcParts(this.c.style.width).pixels).toBe(5);
    });

    it('splits vertically when direction is vertical', function() {
        Split(['a', 'b'], {
            direction: 'vertical'
        });

        expect(this.a.style.height).toBe('calc(50% - 5px)');
        expect(this.b.style.height).toBe('calc(50% - 5px)');
    });

    it('splits in percentages when given sizes', function() {
        Split(['a', 'b'], {
            sizes: [25, 75]
        });

        expect(this.a.style.width).toBe('calc(25% - 5px)');
        expect(this.b.style.width).toBe('calc(75% - 5px)');
    });

    it('splits in percentages when given sizes', function() {
        Split(['a', 'b'], {
            sizes: [25, 75]
        });

        expect(this.a.style.width).toBe('calc(25% - 5px)');
        expect(this.b.style.width).toBe('calc(75% - 5px)');
    });

    it('accounts for gutter size', function() {
        Split(['a', 'b'], {
            gutterSize: 20
        });

        expect(this.a.style.width).toBe('calc(50% - 10px)');
        expect(this.b.style.width).toBe('calc(50% - 10px)');
    });

    it('accounts for gutter size with more than two elements', function() {
        Split(['a', 'b', 'c'], {
            gutterSize: 20
        });

        expect(calcParts(this.a.style.width).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.b.style.width).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.c.style.width).percentage).toBeCloseTo(33.33);

        expect(calcParts(this.a.style.width).pixels).toBe(10);
        expect(calcParts(this.b.style.width).pixels).toBe(20);
        expect(calcParts(this.c.style.width).pixels).toBe(10);
    });

    it('accounts for gutter size when direction is vertical', function() {
        Split(['a', 'b'], {
            direction: 'vertical',
            gutterSize: 20
        });

        expect(this.a.style.height).toBe('calc(50% - 10px)');
        expect(this.b.style.height).toBe('calc(50% - 10px)');
    });

    it('accounts for gutter size with more than two elements when direction is vertical', function() {
        Split(['a', 'b', 'c'], {
            direction: 'vertical',
            gutterSize: 20
        });

        expect(calcParts(this.a.style.height).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.b.style.height).percentage).toBeCloseTo(33.33);
        expect(calcParts(this.c.style.height).percentage).toBeCloseTo(33.33);

        expect(calcParts(this.a.style.height).pixels).toBe(10);
        expect(calcParts(this.b.style.height).pixels).toBe(20);
        expect(calcParts(this.c.style.height).pixels).toBe(10);
    });
});
