import AsyncSelect from 'react-select/async';

export default function CustomAsyncSelect({ label, value, onChange, addClass, isLoading, filterFn, getOptionLabel, getOptionValue }) {
  function loadOptions(inputValue, callback) {
    setTimeout(() => {
      callback(filterFn(inputValue));
    }, 500);
  };

  return (
    <div>
      <label className="block mb-1 text-xs uppercase">{label}</label>
      <AsyncSelect
        value={isLoading ? 'Loading...' : value}
        onChange={onChange}
        disabled={isLoading}
        required
        unstyled
        classNames={{
          control: (state) => 'border-2 outline-none p-2 rounded-md text-sm w-full' + (state.isDisabled ? ' bg-gray-100 border-gray-100 text-gray-400' : ' bg-gray-200 text-gray-700') +` ${addClass}`,
          loadingMessage: () => 'float-left px-2 py-1 text-gray-700 text-sm',
          menu: () => 'bg-white py-2 rounded-lg shadow-sm',
          menuList: () => 'text-sm',
          noOptionsMessage: () => 'float-left px-2 py-1 text-gray-700 text-sm',
          option: (state) => 'px-2 py-1 text-gray-700' + (state.isFocused ? ' bg-gray-200' : '') + (state.isSelected ? ' bg-gray-200' : ''),
          placeholder: (state) => state.isDisabled ? ' text-gray-400' : 'text-gray-700',
        }}
        loadOptions={loadOptions}
        cacheOptions
        components={{ LoadingIndicator: null }}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        isDisabled={isLoading}
        isLoading={isLoading}
        noOptionsMessage={() => 'Type to search'}
        placeholder={isLoading ? 'Loading...' : 'Select...'}
      />
    </div>
  );
}
