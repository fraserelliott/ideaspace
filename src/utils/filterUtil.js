export function includeIdea(idea, tagFilters = [], searchTerm = "") {
  const matchesSearch = idea.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase().trim());

  const categories = tagFilters.filter((tag) => tag.exclusive);
  const tags = tagFilters.filter((tag) => !tag.exclusive);

  const matchesCategories =
    categories.length === 0 ||
    categories.some((category) =>
      idea.ideatags.some((ideaTag) => ideaTag.id === category.id)
    );

  const matchesTags =
    tags.length === 0 ||
    tags.some((tag) => idea.ideatags.some((ideaTag) => ideaTag.id === tag.id));

  return matchesSearch && matchesCategories && matchesTags;
}
