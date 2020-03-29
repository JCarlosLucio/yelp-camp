const starsSelectAdd = document.querySelectorAll('.star-select-add');
const starsSelectEdit = document.querySelectorAll('.star-select-edit');

const oneStar = document.querySelector('#one');
const twoStar = document.querySelector('#two');
const threeStar = document.querySelector('#three');
const fourStar = document.querySelector('#four');
const fiveStar = document.querySelector('#five');

const oneStarEdit = document.querySelector('#oneEdit');
const twoStarEdit = document.querySelector('#twoEdit');
const threeStarEdit = document.querySelector('#threeEdit');
const fourStarEdit = document.querySelector('#fourEdit');
const fiveStarEdit = document.querySelector('#fiveEdit');

const hiddenInput = document.querySelector('#hidden');
const hiddenInputEdit = document.querySelector('#hiddenEdit');

function removeStarFlair(flair) {
    oneStar.classList.remove(flair);
    twoStar.classList.remove(flair);
    threeStar.classList.remove(flair);
    fourStar.classList.remove(flair);
    fiveStar.classList.remove(flair);
}

function removeStarEditFlair(flair) {
    oneStarEdit.classList.remove(flair);
    twoStarEdit.classList.remove(flair);
    threeStarEdit.classList.remove(flair);
    fourStarEdit.classList.remove(flair);
    fiveStarEdit.classList.remove(flair);
}

starsSelectAdd.forEach((starAdd) => {
    starAdd.addEventListener('click', (e) => {
        switch (starAdd.attributes.id.value) {
            case 'one':
                removeStarFlair('yellow');
                oneStar.classList.add('yellow');
                hiddenInput.attributes.value.value = 1;
                break;
            case 'two':
                removeStarFlair('yellow');
                oneStar.classList.add('yellow');
                twoStar.classList.add('yellow');
                hiddenInput.attributes.value.value = 2;
                break;
            case 'three':
                removeStarFlair('yellow');
                oneStar.classList.add('yellow');
                twoStar.classList.add('yellow');
                threeStar.classList.add('yellow');
                hiddenInput.attributes.value.value = 3;
                break;
            case 'four':
                removeStarFlair('yellow');
                oneStar.classList.add('yellow');
                twoStar.classList.add('yellow');
                threeStar.classList.add('yellow');
                fourStar.classList.add('yellow');
                hiddenInput.attributes.value.value = 4;
                break;
            case 'five':
                oneStar.classList.add('yellow');
                twoStar.classList.add('yellow');
                threeStar.classList.add('yellow');
                fourStar.classList.add('yellow');
                fiveStar.classList.add('yellow');
                hiddenInput.attributes.value.value = 5;
                break;
            default:
                removeStarFlair('yellow');
                break;
        }
    });
    starAdd.addEventListener('mouseenter', (e) => {
        switch (starAdd.attributes.id.value) {
            case 'one':
                removeStarFlair('yellow-shadow');
                oneStar.classList.add('yellow-shadow');
                break;
            case 'two':
                removeStarFlair('yellow-shadow');
                oneStar.classList.add('yellow-shadow');
                twoStar.classList.add('yellow-shadow');
                break;
            case 'three':
                removeStarFlair('yellow-shadow');
                oneStar.classList.add('yellow-shadow');
                twoStar.classList.add('yellow-shadow');
                threeStar.classList.add('yellow-shadow');
                break;
            case 'four':
                removeStarFlair('yellow-shadow');
                oneStar.classList.add('yellow-shadow');
                twoStar.classList.add('yellow-shadow');
                threeStar.classList.add('yellow-shadow');
                fourStar.classList.add('yellow-shadow');
                break;
            case 'five':
                oneStar.classList.add('yellow-shadow');
                twoStar.classList.add('yellow-shadow');
                threeStar.classList.add('yellow-shadow');
                fourStar.classList.add('yellow-shadow');
                fiveStar.classList.add('yellow-shadow');
                break;
            default:
                removeStarFlair('yellow-shadow');
                break;
        }
    });
});
starsSelectEdit.forEach((starEdit) => {
    starEdit.addEventListener('click', (e) => {
        switch (starEdit.attributes.id.value) {
            case 'oneEdit':
                removeStarEditFlair('yellow');
                oneStarEdit.classList.add('yellow');
                hiddenInputEdit.attributes.value.value = 1;
                break;
            case 'twoEdit':
                removeStarEditFlair('yellow');
                oneStarEdit.classList.add('yellow');
                twoStarEdit.classList.add('yellow');
                hiddenInputEdit.attributes.value.value = 2;
                break;
            case 'threeEdit':
                removeStarEditFlair('yellow');
                oneStarEdit.classList.add('yellow');
                twoStarEdit.classList.add('yellow');
                threeStarEdit.classList.add('yellow');
                hiddenInputEdit.attributes.value.value = 3;
                break;
            case 'fourEdit':
                removeStarEditFlair('yellow');
                oneStarEdit.classList.add('yellow');
                twoStarEdit.classList.add('yellow');
                threeStarEdit.classList.add('yellow');
                fourStarEdit.classList.add('yellow');
                hiddenInputEdit.attributes.value.value = 4;
                break;
            case 'fiveEdit':
                oneStarEdit.classList.add('yellow');
                twoStarEdit.classList.add('yellow');
                threeStarEdit.classList.add('yellow');
                fourStarEdit.classList.add('yellow');
                fiveStarEdit.classList.add('yellow');
                hiddenInputEdit.attributes.value.value = 5;
                break;
            default:
                removeStarEditFlair('yellow');
                break;
        }
    });
    starEdit.addEventListener('mouseenter', (e) => {
        switch (starEdit.attributes.id.value) {
            case 'oneEdit':
                removeStarEditFlair('yellow-shadow');
                oneStarEdit.classList.add('yellow-shadow');
                break;
            case 'twoEdit':
                removeStarEditFlair('yellow-shadow');
                oneStarEdit.classList.add('yellow-shadow');
                twoStarEdit.classList.add('yellow-shadow');
                break;

            case 'threeEdit':
                removeStarEditFlair('yellow-shadow');
                oneStarEdit.classList.add('yellow-shadow');
                twoStarEdit.classList.add('yellow-shadow');
                threeStarEdit.classList.add('yellow-shadow');
                break;
            case 'fourEdit':
                removeStarEditFlair('yellow-shadow');
                oneStarEdit.classList.add('yellow-shadow');
                twoStarEdit.classList.add('yellow-shadow');
                threeStarEdit.classList.add('yellow-shadow');
                fourStarEdit.classList.add('yellow-shadow');
                break;
            case 'fiveEdit':
                oneStarEdit.classList.add('yellow-shadow');
                twoStarEdit.classList.add('yellow-shadow');
                threeStarEdit.classList.add('yellow-shadow');
                fourStarEdit.classList.add('yellow-shadow');
                fiveStarEdit.classList.add('yellow-shadow');
                break;
            default:
                removeStarEditFlair('yellow-shadow');
                break;
        }
    });
});