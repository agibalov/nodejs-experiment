import { expect } from "chai";
import { IsNotEmpty, validateSync } from "class-validator";
import { Trim, sanitize } from "class-sanitizer";

describe('class-validator', () => {
    class Note {
        @IsNotEmpty()
        title: string;

        @IsNotEmpty()
        text: string;
    }

    it('should work', () => {
        const note = new Note();
        note.title = 'hello';
        note.text = '';

        const errors = validateSync(note);
        expect(errors.length).to.equal(1);

        const error = errors[0];
        expect(error.target).to.equal(note);
        expect(error.property).to.equal('text');
        expect(error.value).to.equal('');
        expect(error.children.length).to.equal(0);
        expect(error.constraints['isNotEmpty']).to.equal('text should not be empty');
    });
});

describe('class-sanitizer', () => {
    class Note {
        @Trim()
        title: string;
    }

    it('should work', () => {
        const note = new Note();
        note.title = '   Hello there!!! ';

        sanitize(note);

        expect(note.title).to.equal('Hello there!!!');
    });
});