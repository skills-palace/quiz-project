import { useGetTermsInfiniteQuery } from "@/redux/api/taxonomy-api";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import Select from "react-select";

function SelectTerms({ control }) {
  const [page, setPage] = useState(1);
  const { data = { result: [] }, isFetching } = useGetTermsInfiniteQuery({
    params: { page },
    key: "category",
  });

  const { field } = useController({
    name: "tag",
    control,
    //rules,
  });

  const loadMore = () => {
    if (!isFetching) {
      setPage(page + 1);
    }
  };

  return (
    <Select
      {...field}
      getOptionLabel={(option) => option.title}
      getOptionValue={(option) => option.slug}
      isLoading={isFetching}
      isSearchable
      isMulti
      onMenuScrollToBottom={loadMore}
      options={data.result}
    />
  );
}

export default SelectTerms;
