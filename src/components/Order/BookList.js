export default function BookList(props) {
   let i = 0;
   const content = props.books.map(el => (
      <div className="book-item" key={i++}>
         <p>
            <span>Title:</span> {el.label}
         </p>
         <p>
            <span>Price:</span> {el.price}
         </p>
         <p>
            <span>Quantity:</span> {el.amount}
         </p>
         <button
            onClick={e => props.removeBook(el.label)}
            className="delete-book-button"
         >
            Delete
         </button>
      </div>
   ));

   return content;
}
