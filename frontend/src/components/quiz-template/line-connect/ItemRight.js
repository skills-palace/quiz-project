import React from "react";

const ItemRight = ({ item, lineDraw, disabled,id }) => {
    return (
        <div className="question">
            <input
                type="radio"
                disabled={disabled}
                onChange={() => lineDraw({ id, select: item.id, side: "right" })}
                id={id}
            />
            <p>{item.title}</p>
        </div>
    );
};

export default ItemRight;
