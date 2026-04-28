function FilterData({ query, setQuery }) {
    const filterNow = (e) => {
        const { name, value } = e.target;

        if (value === "disable") {
            const newQuery = { ...query };
            delete newQuery[name];
            setQuery(newQuery);
        } else {
            setQuery({ ...query, [name]: value });
        }
    };

    const filterByTitle = (e) => {
        setQuery({ ...query, title: e.target.value });
    };

    return (
        <>
            <li>
                <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                        <em className="icon ni ni-search"></em>
                    </div>
                    <input
                        onChange={filterByTitle}
                        type="text"
                        className="form-control"
                        placeholder="Quick search by Service Title"
                    />
                </div>
            </li>
            <li>
                <select
                    name="status"
                    className="custom-select"
                    onChange={filterNow}
                >
                    <option value="disable">status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </li>
        </>
    );
}

export default FilterData;
