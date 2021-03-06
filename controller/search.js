const axios = require("axios");

// @desc       Search Movies
// @route      GET /search
// @access     Public
exports.searchMoveis = async (req, res, next) => {
  try {
    const data = [];

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const quality = req.query.quality || "all";
    const rating = req.query.rating || 0;
    const query = req.query.query || 0;
    const genre = req.query.genre || "all";
    const sort = req.query.sort || "date_added";

    const paggination = { limit };

    const movies = await axios.get(
      `${process.env.URL}/list_movies.json?page=${page}&quality=${quality}&minimum_rating=${rating}&query_term=${query}&genre=${genre}&sort_by=${sort}&limit=${limit}`
    );

    if (movies.data.data.movie_count !== 0) {
      const total = movies.data.data.movie_count;
      paggination.count = total;

      if (startIndex > 0) {
        paggination.prevPage = page - 1;
      }

      if (total > endIndex) {
        paggination.nextPage = page + 1;
      }

      movies.data.data.movies.forEach((e, index) => {
        const movie = {
          id: e.id,
          title: e.title_english,
          year: e.year,
          rating: e.rating,
          genres: e.genres,
          language: e.language,
          medium_cover_image: e.medium_cover_image,
        };

        data.push(movie);
      });
    } else {
      return next({
        name: "CostumError",
        message: "Nothing was found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      paggination,
      data,
    });
  } catch (error) {
    next(error);
  }
};
