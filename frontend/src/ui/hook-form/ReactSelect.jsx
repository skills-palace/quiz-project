import { useState, useEffect } from "react";
import { useController } from "react-hook-form";
import Select from "react-select";

const SelectBox = ({
  control,
  name,
  defaultValue,
  useQery,
  rules,
  ...rest
}) => {
  const [options, setOption] = useState([]);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQery({ page });

  const { field } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const loadMore = () => {
    if (data?.total > options.length) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (data?.result) {
      setOption([...options, ...data.result]);
    }
  }, [data]);

  return (
    <Select
      {...field}
      {...rest}
      getOptionLabel={(option) => option.title}
      getOptionValue={(option) => option.slug}
      isLoading={isLoading}
      isSearchable
      onMenuScrollToBottom={loadMore}
      options={options}
    />
  );
};

export default SelectBox;
