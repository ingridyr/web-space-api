class Helpers {
  static paginateData(data, page = 1, perPage = 15) {
    page = Number(page);
    perPage = Number(perPage);

    const start = (page - 1) * perPage;
    const end = start + perPage;

    const dataSliced = data.slice(start, end);

    const previousPage = page - 1 > 1 ? page - 1 : null;
    const nextPage = page + 1;

    return {
      page: page,
      previousPage: previousPage,
      nextPage: nextPage,
      data: dataSliced,
    };
  }
}

module.exports = Helpers;