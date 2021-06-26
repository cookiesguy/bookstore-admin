export default function BookList(props) {
   let i = 0;
   const content = props.books.map(el => (
      <div className="book-item" key={i++}>
         <p>
            <span>Title:</span> {el.info.title}
         </p>
         <p>
            <span>Price:</span> {el.price}
         </p>
         <p>
            <span>Quantity:</span> {el.quantity}
         </p>
         <button
            onClick={e => props.removeBook(el.info.title)}
            className="delete-book-button"
         >
            Delete
         </button>
      </div>
   ));

   return content;
}
