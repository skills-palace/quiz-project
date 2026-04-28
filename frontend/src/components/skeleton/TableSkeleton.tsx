function TableSkeleton() {
    return (
        <div className="dash-tb-item w-100">
            <div className="dash-tb-col dash-tb-col-check">
                <span className="tb-product skeleton-bar"></span>
            </div>
            <div className="dash-tb-col tb-col-sm">
                <span className="tb-product skeleton-bar"></span>
            </div>
            <div className="dash-tb-col">
                <span className="tb-sub skeleton-bar">Sub Item</span>
            </div>
            <div className="dash-tb-col">
                <span className="tb-sub skeleton-bar">Sub Item</span>
            </div>
            <div className="dash-tb-col">
                <span className="tb-sub skeleton-bar">Sub Item</span>
            </div>
            <div className="dash-tb-col tb-col-md">
                <span className="tb-sub skeleton-bar">Sub Item</span>
            </div>

            <div className="dash-tb-col dash-tb-col-tools">
                <ul className="dash-tb-actions gx-3 my-n1">
                    <li className="mr-n1">
                        <span className="tb-product skeleton-bar"></span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default TableSkeleton;
