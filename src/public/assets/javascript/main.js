//BOILERPLATE FÖR FETCH
//FRONT-END

let favoriteSpots = [];

const graphQlQueryGetData = async (url, query, variables = {}) => {
  console.log(variables);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const res = await response.json();
  return res.data;
};

//FÖR QUERY

//Nedan kallas query
const getAllFavoriteSpotQuery = `query getAllFavoriteSpots { getAllFavoriteSpots {
id
name
description
adress
}
}`;

const getListButton = document.getElementById("getListButton");
getListButton.addEventListener("click", async () => {
  getList();
});

async function getList() {
  const response = await graphQlQueryGetData(
    "http://localhost:5000/graphql",
    getAllFavoriteSpotQuery
  );

  console.log(response);

  favoriteSpots = response.getAllFavoriteSpots;

  createHTML(favoriteSpots);
}

function createHTML(favoriteSpots) {
  let favspotList = document.getElementById("favspotList");

  favspotList.innerHTML = "";

  for (let i = 0; i < favoriteSpots.length; i++) {
    let container = document.createElement("div");
    let title = document.createElement("p");
    let description = document.createElement("p");
    let adress = document.createElement("p");
    let deletebutton = document.createElement("button");

    deletebutton.setAttribute("type", "button");

    container.className = "favespot";

    title.innerHTML = favoriteSpots[i].name;
    description.innerHTML = favoriteSpots[i].description;
    adress.innerHTML = favoriteSpots[i].adress;

    title.className = "favespot__title";
    description.className = "favespot__description";
    adress.className = "favespot__adress";
    deletebutton.className = "favespot__button";

    deletebutton.innerHTML = "Ta bort!";

    deletebutton.addEventListener("click", () => {
      console.log(favoriteSpots[i]);
      deleteFromList(favoriteSpots[i].id);
    });

    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(adress);
    container.appendChild(deletebutton);
    favspotList.appendChild(container);
  }
}

//FÖR MUTATION

//Mutation: Create

//Nedan kallas mutation
const createFavoriteSpotMutation = `mutation Mutation($input: CreateFavoriteSpotInput) {
    createFavoriteSpot(input: $input) {
      id
      name
      description
      adress
    }
  }`;

const addForm = document.getElementById("addForm");
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await graphQlQueryGetData(
    "http://localhost:5000/graphql",
    createFavoriteSpotMutation,
    {
      input: {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        adress: document.getElementById("adress").value,
      },
    }
  );
  getList();
});

//Mutation: Delete

const deleteFavoriteSpotMutation = `mutation Mutation($favespotId: ID!) {
    deleteFavoriteSpot(favespotId: $favespotId) {
      deletedId
      success
    }
  }`;

async function deleteFromList(id) {
  const response = await graphQlQueryGetData(
    "http://localhost:5000/graphql",
    deleteFavoriteSpotMutation,
    {
      favespotId: id,
    }
  );

  console.log(response);
  getList();
}
