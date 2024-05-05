const listContainer = document.querySelector(".list-container");
const selectedPersonContainer = document.querySelector(".form-select");
const movieContainer = document.querySelector(".movie-selection");
const ratingContainer = document.getElementById("rangeOutputId");
const movieListContainer = document.querySelector(".movie-container");
const searchContainer = document.querySelector(".search");
const searchBtn = document.querySelector(".search-btn");
const getMoviesBtn = document.querySelector(".suggestions");
const familyFriendlyCheckbox = document.querySelector(".family-friendly"); 
const titleBar = document.querySelector(".row-2")

const api_key="6af57a5cf47289dd6788043a2cc7d90d";
const api_url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28|18|16|12|14|35|10751&total_results=100";
const kid_url = "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=10751";



let date;
let starClicked = 0;
let rating;
let starContainer;
let itemsArray = [];
let newItemArray = [];
let onlyKidFriendly = false;


class ListItem {
  newItem = "";
  constructor(container, date, person, movie, rating, saved) {
    this.container = container;
    this.date = date;
    this.person = person;
    this.movie = movie;
    this.rating = rating;

    this.addToContainer();

    if (saved == false) {
      this.saveItem();
    }
  }



  saveItem() {
    let prevDate = localStorage.getItem("date");
    prevDate = prevDate ? prevDate + " |@! " + this.date : this.date;
    localStorage.setItem("date", prevDate);
    console.log(prevDate);

    let prevPerson = localStorage.getItem("person");
    prevPerson = prevPerson ? prevPerson + " |@! " + this.person : this.person;
    localStorage.setItem("person", prevPerson);
    console.log(prevPerson);

    let prevMovie = localStorage.getItem("movie");
    prevMovie = prevMovie ? prevMovie + " |@! " + this.movie : this.movie;
    localStorage.setItem("movie", prevMovie);
    console.log(prevMovie);

    let prevRating = localStorage.getItem("rating");
    prevRating = prevRating ? prevRating + " |@! " + this.rating : this.rating;
    localStorage.setItem("rating", prevRating);
    console.log(prevRating);
  }

  addToContainer() {
    this.newItem = document.createElement("li");
    this.newItem.setAttribute("class", "row");
    this.container.appendChild(this.newItem);

    let dateElem = document.createElement("p");
    let date = new Date();
    let noTimeDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    date.setDate(date.getDate());
    dateElem.innerHTML = noTimeDate;
    dateElem.classList.add("col");
    this.newItem.appendChild(dateElem);
    this.date = noTimeDate;

    let nameElem = document.createElement("p");
    nameElem.innerHTML = `${this.person}`;
    nameElem.classList.add("col");
    this.newItem.appendChild(nameElem);

    let movieElem = document.createElement("p");
    movieElem.innerHTML = `${this.movie}`;
    movieElem.classList.add("col");
    this.newItem.appendChild(movieElem);

    let ratingElem = document.createElement("p");
    ratingElem.innerHTML = `${this.rating}`;
    ratingElem.classList.add("col");
    this.newItem.appendChild(ratingElem);

    let deleteBtn = document.createElement("p")
    deleteBtn.innerHTML = "X"
    deleteBtn.onclick = () => {
        this.deleteItem()
    }
    deleteBtn.classList.add("col")
    this.newItem.appendChild(deleteBtn)
  }
  deleteItem() {
    // Remove the item from the UI
    this.container.removeChild(this.newItem);

    // Remove the item from local storage
    let storedDate = localStorage.getItem("date").split(" |@! ");
    storedDate.splice(storedDate.indexOf(this.date), 1);
    localStorage.setItem("date", storedDate.join(" |@! "));

    let storedPerson = localStorage.getItem("person").split(" |@! ");
    storedPerson.splice(storedPerson.indexOf(this.person), 1);
    localStorage.setItem("person", storedPerson.join(" |@! "));

    let storedMovie = localStorage.getItem("movie").split(" |@! ");
    storedMovie.splice(storedMovie.indexOf(this.movie), 1);
    localStorage.setItem("movie", storedMovie.join(" |@! "));

    let storedRating = localStorage.getItem("rating").split(" |@! ");
    storedRating.splice(storedRating.indexOf(this.rating), 1);
    localStorage.setItem("rating", storedRating.join(" |@! "));
  }
}

let itemArray = [];

function add() {
  titleBar.classList.remove("hidden")
  let rating = ratingContainer.value;
  let selectedPerson = selectedPersonContainer.value;
  let selectedMovie = movieContainer.value;
  itemArray.push(
    new ListItem(
      listContainer,
      date,
      selectedPerson,
      selectedMovie,
      rating,
      false
    )
  );
  clearInput();
}

function clearInput() {
  movieContainer.value = "";
  
}


function startApp() {
  try {
    const storedDates = localStorage.getItem("date");
    const storedPersons = localStorage.getItem("person");
    const storedMovies = localStorage.getItem("movie");
    const storedRatings = localStorage.getItem("rating");

    if (!storedDates || !storedPersons || !storedMovies || !storedRatings) {
      console.error("One or more items not found in localStorage.");
      return;
    }

    const splitAndJoin = (item) => item.split(" |@! ").join(" <br><br> ");
    const dates = splitAndJoin(storedDates).split(" <br><br> ");
    const persons = splitAndJoin(storedPersons).split(" <br><br> ");
    const movies = splitAndJoin(storedMovies).split(" <br><br> ");
    const ratings = splitAndJoin(storedRatings).split(" <br><br> ");

    dates.forEach((date, index) => {
      newItemArray.push(
        new ListItem(
          listContainer,
          date,
          persons[index],
          movies[index],
          ratings[index],
          true
        )
      );
    });

    console.log("startApp completed successfully.");
  } catch (error) {
    console.error("Error in startApp:", error);
  }
}



const getMovies =()=>{
  console.log('click get movies', onlyKidFriendly)

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWY1N2E1Y2Y0NzI4OWRkNjc4ODA0M2EyY2M3ZDkwZCIsInN1YiI6IjYyOTQzODY0NGJmYTU0MDA1MTMzZTZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DRyVzMXKlvWBpV261UKAteknpSC8FImP_rKbRspnv_E'
    }
  };
  if(onlyKidFriendly){
    url = kid_url;
  }else{
    url = api_url;
  }
  fetch(url, options)
  .then(response => response.json())
  .then(allMovieData => {
    allMovieData = allMovieData.results;


    showMovieData(allMovieData);
  })
  .catch(err => console.error(err));
}

function search() {
  const searchText = searchContainer.value;
  const newSearchText = searchText.toLowerCase();
  movieListContainer.innerHTML = "";
  if (searchText !== "") {
    getMovies(
      "https://api.themoviedb.org/3/search/movie?api_key=6af57a5cf47289dd6788043a2cc7d90d&query=" +
        `${newSearchText}`
    );
  } else {
    getMovies(api_url);
  }
}



function showMovieData(allMovieData) {
 



  movieListContainer.innerHTML = "";
  shuffle(allMovieData);

  let movieData = allMovieData.slice(0, 4);
  let uniqueMovies = [...new Set(movieData)];
  console.log('uniqueMovies', uniqueMovies)

  uniqueMovies.map((item) => {
    const title = item.title;
    const id = item.id;
    const overview = item.overview;
    const image = item.backdrop_path;
    const releaseDate = item.release_date;
    const genreArray = item.genre_ids;
    let kidFriendly = false;
    const genre = genreArray.map((item) => {
   
      if (item === 10751) {
        kidFriendly = true;
      }
    });

    // let familyMovies = uniqueMovies.filter()

    if (image) {
      const newMovie = document.createElement("div");
      movieListContainer.appendChild(newMovie);

      newMovie.classList.add("newMovie");
      // newMovie.classList.add("col")
      const imgDiv = document.createElement("div");
      newMovie.appendChild(imgDiv);
      imgDiv.classList.add("imgDiv");

      const movieImg = document.createElement("img");
      movieImg.src = `https://www.themoviedb.org/t/p/w220_and_h330_face/${image}`;
      imgDiv.appendChild(movieImg);
      movieImg.classList.add("movieImg");
      // movieImg.classList.add("col")

      const movieDataContainer = document.createElement("div");
      movieDataContainer.classList.add("movieDataContainer");
      newMovie.appendChild(movieDataContainer);

      const movieTitle = document.createElement("h3");
      movieTitle.innerHTML = `${title}`;
      movieDataContainer.appendChild(movieTitle);

      const movieReleaseDate = document.createElement("p");
      movieReleaseDate.innerHTML = `${releaseDate}`;
      movieDataContainer.appendChild(movieReleaseDate);
      movieReleaseDate.classList.add("releaseDate");

      const kidFriendlyTag = document.createElement("p");
      kidFriendlyTag.innerHTML = `${kidFriendly ? "Kid Friendly" : ""}`;
      movieDataContainer.appendChild(kidFriendlyTag);
      kidFriendlyTag.classList.add("kid-tag");

      // const movie

      const movieOverview = document.createElement("p");
      movieOverview.innerHTML = `${overview}`;
      movieDataContainer.appendChild(movieOverview);
    }
  });
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

getMoviesBtn.addEventListener("click", getMovies);
familyFriendlyCheckbox.addEventListener('change', function() {
  onlyKidFriendly = this.checked; // Update onlyKidFriendly based on checkbox state
});

startApp();
