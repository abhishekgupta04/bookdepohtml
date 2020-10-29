let elem = document.getElementById('app-container');

let authorName = document.getElementById('authorName');
let bookName = document.getElementById('bookName');
let bookPrice = document.getElementById('bookPrice');
let bookList = document.getElementById('listOfBooks');
let listOfFav = document.getElementById('listOfFav');
let search = document.getElementById('searchTxt');


onStart();

function onStart() {
    printBooks();
    printFav();
    printFavData();
}



function addBookToList(e) {
    e.preventDefault();
    let json = {
        "authorName": authorName.value,
        "bookName": bookName.value,
        "bookPrice": bookPrice.value
    }
    if (authorName.value == "" || bookName.value == "" || bookPrice.value == "") {
        var x = document.getElementById("form-error");
        x.classList.add("show");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    else {
        let items = localStorage.getItem('bookList');
        if (items) {
            items = JSON.parse(items);
        } else {
            items = [];
        }

        items.push(json);
        localStorage.setItem('bookList', JSON.stringify(items));
        console.log(items);
        printBooks();
        var x = document.getElementById("form-success");
        x.classList.add("show");
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        authorName.value = "";
        bookName.value = "";
        bookPrice.value = "";
    }
    elemBookCount();
}

function printBooks() {
    let items = localStorage.getItem('bookList');
    if (items) {
        items = JSON.parse(items);
        let html = ""
        let index = 0;
        items.forEach(detail => {
            var dataId = `${detail.bookName + - + detail.bookPrice}`;
            dataId = dataId.replace(/\s+/g, "");
            let id = `card-${index}`;
            html += `
                <!-- ${index} -->
                <div class="book-card" id="${id}" data-id="${dataId}">
                    <div class="book-delete-layer" onclick="deleteDetails(${index},'${id}',event)"><img src="./img/delete.png"></div>
                    <div class="book-card-box">
                        <div class="card-top">
                            <div class="book-fav-layer" onclick="markFav(${index},'${id}',event);"><span><i class="fa fa-heart-o" aria-hidden="true"></i><i class="fa fa-heart" aria-hidden="true"></i></span><span class="book-fav-text">Add to favourite</span></div>
                        </div>
                        <div class="img-box"></div>
                        <div class="book-title">${detail.bookName}</div>
                        <div class="card-bottom">
                            <div class="book-author-layer"><span>By </span><span class="book-author">${detail.authorName}</span></div>
                            <div class="book-price-layer"><span><i class="fa fa-inr" aria-hidden="true"></i></span><span class="book-price">${detail.bookPrice}</span></div>
                        </div>
                    </div>
                </div>   

                `;
            index++;
        })
        if (typeof (bookList) != 'undefined' && bookList != null) {
            bookList.innerHTML = html;
            if (bookList.innerHTML == "") {
                bookList.innerHTML = `Nothing to show! Use "Add Books" from books section!!`;
            }
        }
    } else {
        items = [];
        if (typeof (bookList) != 'undefined' && bookList != null) {
            bookList.innerHTML = `Nothing to show! Use "Add Books" from books section!!`;
        }
    }
}

function markFav(index, detail, event) {
    let idData = event.target.closest("[data-id]").getAttribute("data-id");
    let favList = localStorage.getItem('favList');
    if (favList) {
        favList = JSON.parse(favList);
    } else {
        favList = {};
    }
    let flag = favList[idData];
    if (flag) {
        favList[idData] = false;
    } else {
        favList[idData] = true;
    }
    var sortArr = Object.keys(favList).sort().reduce(function (Obj, key) {
        Obj[key] = favList[key];
        return Obj;
    }, {});
    localStorage.setItem('favList', JSON.stringify(sortArr));
    addFav(index, idData);
    printFav();
    elemBookCount();
}

function addFav(index, event) {
    console.log(index, event)
    let favBookName = document.getElementById(`card-${index}`);
    let favBooksObjVal = {
        favBookDataID: favBookName.getAttribute("data-id"),
        favBookID: favBookName.getAttribute("id"),
        favBookName: favBookName.querySelector(".book-title").innerText,
        favBookAuthor: favBookName.querySelector(".book-author").innerText,
        favBookPrice: favBookName.querySelector(".book-price").innerText
    }

    var addBook = JSON.parse(localStorage.getItem("addList")) || [];

    indexOfValue = addBook.map(function (e) { return e.favBookDataID; }).indexOf(event);

    if (indexOfValue == -1) {
        addBook.push(favBooksObjVal);
    } else {
        addBook = addBook.filter(function (obj) {
            return obj.favBookDataID !== event;
        });
    }

    localStorage.setItem('addList', JSON.stringify(addBook));
}

function printFavData() {
    let bookMark = localStorage.getItem('addList');

    if (bookMark) {
        bookMark = JSON.parse(bookMark);
        let html = ""
        let index = 0;
        bookMark.forEach(bookMarkData => {
            let id = `card-${index}`;
            html += `
            <div class="book-card" id="${id}" data-id="${bookMarkData.favBookDataID}">
                <div class="book-delete-layer" onclick="deleteFav(${index},'${id}',event)">
                    <img src="./img/cross.png" class="cross">
                    <img src="./img/hover-cross.png" class="cross-hover">
                </div>
                <div class="book-card-box">
                    <div class="img-box"></div>
                    <div class="book-title">${bookMarkData.favBookName}</div>
                    <div class="card-bottom">
                        <div class="book-author-layer"><span>By </span><span class="book-author">${bookMarkData.favBookAuthor}</span></div>
                        <div class="book-price-layer"><span><i class="fa fa-inr" aria-hidden="true"></i></span><span class="book-price">${bookMarkData.favBookPrice}</span></div>
                        </div> 
                    </div>
                </div>   
            </div>
            `;
            index++;
        })
        if (typeof (listOfFav) != 'undefined' && listOfFav != null) {
            listOfFav.innerHTML = html;
            if (listOfFav.innerHTML == "") {
                listOfFav.innerHTML = `Nothing to show! Use "Add fav Books" from books section!!`;
            }
        }
    } else {
        bookMark = [];
        if (typeof (listOfFav) != 'undefined' && listOfFav != null) {
            listOfFav.innerHTML = `Nothing to show! Use "Add fav Books" from books section!!`;
        }
    }
}

function printFav() {
    let favList = JSON.parse(localStorage.getItem('favList'));
    try {
        Object.keys(favList).forEach(key => {
            if (favList[key] == true) {
                document.querySelector(`[data-id="${key}"]`).classList.add("fav");
                // document.getElementById(key).classList.add("fav");
            } else {
                document.querySelector(`[data-id="${key}"]`).classList.remove("fav");
                // document.getElementById(key).classList.remove("fav");
            }
        })
    } catch (e) {
        console.log(e);
    }
}

function deleteDetails(index, id, e) {
    try {
        let idData = e.target.parentElement.parentElement.getAttribute("data-id");
        let items = JSON.parse(localStorage.getItem('bookList'));
        items.splice(index, 1);
        localStorage.setItem('bookList', JSON.stringify(items));
        printBooks();
        var addBook = JSON.parse(localStorage.getItem("addList"));
        addBook = addBook.filter(function (obj) {
            // return obj.favBookDataID !== id;
            return obj.favBookDataID !== idData;
        });
        localStorage.setItem('addList', JSON.stringify(addBook));
        printFavData();
        elemBookCount();
        let fav = JSON.parse(localStorage.getItem('favList'));
        fav[idData] = false;
        delete fav[idData];
        localStorage.setItem('favList', JSON.stringify(fav));
        printFav();
    } catch (e) {
        console.log(e);
    }
}
function deleteFav(index, id, e) {
    try {
        let idData = e.target.parentElement.parentElement.getAttribute("data-id");
        var addBook = JSON.parse(localStorage.getItem("addList"));
        addBook.splice(index, 1);
        localStorage.setItem('addList', JSON.stringify(addBook));
        printFavData();
        let fav = JSON.parse(localStorage.getItem('favList'));
        fav[idData] = false;
        localStorage.setItem('favList', JSON.stringify(fav));
        printFav();
        elemBookCount();
    } catch (e) {
        console.log(e);
    }
}


if (typeof (search) != 'undefined' && search != null) {
    search.addEventListener("input", function () {
        var input, filter, cards, cardContainer, title, i;
        input = document.getElementById("searchTxt");
        filter = input.value.toUpperCase();
        cardContainer = document.getElementById("main-wrapper");
        cards = cardContainer.getElementsByClassName("book-card");
        for (i = 0; i < cards.length; i++) {
            title = cards[i].querySelector(".book-title");
            if (title.innerText.toUpperCase().indexOf(filter) > -1) {
                cards[i].style.display = "";
            } else {
                cards[i].style.display = "none";
            }
        }
        noResult();
    })
}

function noResult() {
    divs = document.querySelectorAll('.childCount > div');
    var divsArray = [].slice.call(divs);
    var displayNone = divsArray.filter(function (el) {
        return getComputedStyle(el).display === "none"
    });
    var displayShow = divsArray.filter(function (el) {
        return getComputedStyle(el).display !== "none"
    });
    var numberOfHiddenDivs = displayNone.length;
    var numberOfVisibleDivs = displayShow.length;

    let noResult = document.querySelector(".no-result");
    if (numberOfVisibleDivs === 0) {
        noResult.classList.add("found");
    }
    else {
        noResult.classList.remove("found");
    }
}

function elemBookCount() {
    let bookCount = document.querySelector("#book-count");
    let bookFavCount = document.querySelector("#favbook-count");
    if (localStorage.getItem('bookList') == null) {
        bookCount.innerText = 0;
    } else {
        let bookCountLength = JSON.parse(localStorage.getItem('bookList')).length;
        bookCount.innerText = bookCountLength;
    }

    if (localStorage.getItem('addList') == null) {
        bookFavCount.innerText = 0;
    } else {
        let bookFavCountLength = JSON.parse(localStorage.getItem('addList')).length
        bookFavCount.innerText = bookFavCountLength;
    }
}

elemBookCount();