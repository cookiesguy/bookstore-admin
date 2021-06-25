export default function Option(props) {
  const list = props.category.map(element => (
    <option key={element.id} value={element.name}>
      {element.name}
    </option>
  ));

  const selectBoxChange = event => {
    props.changeCategoryId({
      id: event.target.options.selectedIndex + 1,
      name: event.target.value,
    });
  };
        
  return (
    <select onChange={selectBoxChange} defaultValue={props.currentCategory} className="select-category">
      {list}
    </select>
  );
}
