import React from "react";

const Item = ({ item, lineDraw, disable,id }) => {
    return (
        <div className="question">
            <p>{item.title}</p>
            <input
                disabled={disable}
                onChange={() => lineDraw({ id,select:item.id, side: "left" })}
                type="radio"
                id={id}
            />
        </div>
    );
};

export default Item;
