# Table Component

The Table component is a reusable component that can be used to display data in a table.
The component will take all available space of its parent so make sure to wrap it in a container with a fixed width/height.

## Props
- storageKey: (optional) This key will be used to save columnwidths in localstorage. If no key is provided, the columnwidths will not be saved.
- translationKey: (required) This will be used as a prefix for all column header translations. 
  - Example: you define a `page:table` object in the translation files. The table will look for `page:table.$columnKey` to be used as the column header.
- emptyCellPlaceholder: (optional) This will be used as a placeholder for empty cells. This will default to `-`
- searchValue: (optional) This will be used to filter the table. You will need to handle the searchValue in the parent component and pass it to the table.

### Columns prop
The columns prop is an array of objects, this array will define the columns and order of them

- key: (required) This will be used as a key to access the data for this column. This is also the key that will be used for header label
- excludeFromSearch: (optional) This will exclude the entire column from the search functionality
- disallowSorting: (optional) This will remove the button to sort the column (useful for buttoncolumn)
- defaultSort: (optional) Only use on one column, this will be the column for which the table which be sorted by default
- initialWidth: (optional) This will be the initial width of the column. If no initialWidth is provided, the column will default to 200px
- minimumWidth: (optional) This will limit how small you can resize the column. If no minimumWidth is provided, the column will default to 75px
- emptyHeader: (optional) This will set the column header to be empty
- disableResizing: (optional) This will disable the resizing of the column (useful for buttoncolumn)
- transform: (optional) If you define this function, the table will not use the value from dataprop but call this function and display the return value instead. This is useful to display the value in a colored pill for example

### Data prop
The data prop is an array of objects, this array will define the data that will be displayed in the table

Every item in the array is a row, and every key in the object is a column. These keys should match the column keys but typescript will enforce this.