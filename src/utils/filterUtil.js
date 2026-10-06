export function includeIdea(idea, tagFilters = [], searchTerm = "") {
  const matchesSearch = idea.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase().trim());

  const nonExclusive = tagFilters.filter((t) => !t.exclusive);
  const exclusive = tagFilters.filter((t) => t.exclusive);

  const matchesNonExclusive =
    nonExclusive.length === 0 ||
    nonExclusive.some((tagFilter) =>
      idea.ideatags.some((ideaTag) => ideaTag.id === tagFilter.id)
    );

  const matchesExclusive = exclusive.every((tagFilter) =>
    idea.ideatags.some((ideaTag) => ideaTag.id === tagFilter.id)
  );

  return matchesSearch && matchesNonExclusive && matchesExclusive;
}
