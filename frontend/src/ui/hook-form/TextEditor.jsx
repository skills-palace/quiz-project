import { useState, useRef } from "react";
import { useController } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
// import Media from "@dashboard/media/modal";
// import Modal from "@dashboard/modal";

export default function FormEditor({ control, name, rules }) {
  const [modal, setModal] = useState(false);
  const editorRef = useRef(null);

  const {
    field: { ref, value, onChange },
    // fieldState: { invalid, isTouched, isDirty },
    //  formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules,
  });

  const setFile = (file) => {
    editorRef.current.insertContent(
      '<img alt="image" width="200px" src="' +
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/file/images/${file}` +
        '"/>'
    );
  };

  return (
    <>
      {/* <Modal isOpen={modal} close={() => setModal(false)}>
        <Media
          close={() => setModal(false)}
          option={{ multiple: false }}
          setFile={setFile}
        />
      </Modal> */}
      <Editor
        ref={ref}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onBlur={(e) => onChange(editorRef.current.getContent())}
        initialValue={value ? value : ""}
        init={{
          body_class: "my_class",
          height: 500,
          menubar: true,

          plugins:
            "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template table charmap hr pagebreak nonbreaking anchor advlist lists wordcount imagetools textpattern noneditable charmap emoticons",

          toolbar:
            "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect custom-gallery | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview | image media link",

          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          setup: (editor) => {
            editor.ui.registry.addButton("custom-gallery", {
              text: "Gallery",
              onAction: function (_) {
                setModal(true);
                // editor.insertContent(
                //   "&nbsp;<strong>It's my button!</strong>&nbsp;"
                // );
              },
            });
          },
        }}
      />
    </>
  );
}
