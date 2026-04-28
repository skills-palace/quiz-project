import { useState } from "react";
import { Controller, useController } from "react-hook-form";
import Modal from "@/dashboard/media/modal";
import Image from "next/image";
function Answer({ idx, control }) {
  const {
    field: { value, onChange },
  } = useController({ name: `quizes.${idx}.image`, control });
  const [modal, setModal] = useState(false);

  const setImage = (file) => {
    setModal(false);
    onChange(file);
  };

  return (
    <div>
      <div
        onClick={() => setModal(true)}
        className="w-9 h-9 relative border border-slate-300 mr-2"
      >
        {/* <img src={"/upload/images/" + value} /> */}
        <Image
          className="object-contain"
          alt="image"
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/image/${value}`}
          fill
          // width="100%"
          // height="100%"
          placeholder="blur"
          blurDataURL="/icon.png"
        />
      </div>
      <Modal
        isOpen={modal}
        toggle={() => setModal((prev) => !prev)}
        onChange={setImage}
        values={value ? [value] : []}
      />
    </div>
  );
}

export default Answer;
