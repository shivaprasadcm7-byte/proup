const Filters = ({
  search,
  setSearch,
  category,
  setCategory,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search events"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All</option>
        <option>Science</option>
        <option>Hackathon</option>
        <option>Finance</option>
      </select>

      <button onClick={() => setViewMode("grid")}>Grid</button>
      <button onClick={() => setViewMode("list")}>List</button>
    </div>
  );
};

export default Filters;
