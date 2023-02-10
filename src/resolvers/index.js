const path = require("path");
const fsPromises = require("fs/promises");
const {
  fileExists,
  readJsonFile,
  deleteFile,
  getDirectoryFileNames,
} = require("../utils/fileHandling");
const { GraphQLError, responsePathAsArray } = require("graphql");
const crypto = require("crypto");
const axios = require("axios").default;

//BACKEND!

//UPPDATERA FÖR DETTA PROJEKT

//Behöver inte pga inte har data här utan i Google-Sheet?
//const favespotDirectory = path.join(__dirname, "..", "data", "todos"); //gör detta pga DRY då vi återanvänder denna

exports.resolvers = {
  Query: {
    // getFavoriteSpotById: async (_, args) => {
    //   const favespotId = args.projectId;
    //   const favespotFilePath = path.join(
    //     favespotDirectory,
    //     `${favespotId}.json`
    //   );
    //   const favespotExists = await fileExists(favespotFilePath);
    //   if (!favespotExists)
    //     return new GraphQLError("That faveSpot does not exist");
    //   const favespotData = await fsPromises.readFile(favespotFilePath, {
    //     encoding: "utf-8",
    //   });
    //   const data = JSON.parse(favespotData);
    //   return data;
    // },

    //Se över favespotDirectory

    getAllFavoriteSpots: async (_, args) => {
      let favoriteSpotsList = [];
      try {
        const response = await axios.get(process.env.SHEETDB_URI);
        if (response.data?.length > 0) {
          favoriteSpotsList = response.data;
        }
      } catch (error) {
        console.error(error);
        return new GraphQLError("Ooops... something went wrong!");
      }
      return favoriteSpotsList;
    },
  },
  Mutation: {
    createFavoriteSpot: async (_, args) => {
      const { name, description, adress } = args.input;
      const newFavespot = {
        id: crypto.randomUUID(),
        name,
        description: description || "",
        adress,
      };

      try {
        // const endpoint = `${process.env.SHEETDB_URI}?sheet=FaveSpots`;
        const endpoint = process.env.SHEETDB_URI;
        const response = await axios.post(
          endpoint,
          {
            data: [newFavespot],
          },
          {
            headers: {
              "Accept-Encoding": "gzip,deflate,compress",
            },
          }
        );
      } catch (error) {
        console.error(error);
        return new GraphQLError("Could not create your favespot...");
      }
      // IF (success) return JS objekt som mostvarar våran Ticket type i schemat
      return newFavespot;
    },

    deleteFavoriteSpot: async (_, args) => {
      const favespotId = args.favespotId;

      try {
        const endpoint = `${process.env.SHEETDB_URI}/id/${favespotId}`; // är motsvarande för dokumentationen /api/v1/{API_ID}/{COLUMN_NAME}/{VALUE}

        const response = await axios.delete(endpoint);

        console.log(response.data);

        return {
          deletedId: favespotId,
          success: true,
        };
      } catch (error) {
        console.log(error);
        return {
          deletedId: favespotId,
          success: false,
        };
      }
    },
    // updateFavoriteSpot: async (_, args) => {},
  },
};
