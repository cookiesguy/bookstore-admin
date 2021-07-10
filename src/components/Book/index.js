import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import cache from 'memory-cache';
import {
   faPenAlt,
   faPlusCircle,
   faTrash,
   faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { find, isUndefined, isNull } from 'lodash';
import {
   addNewBook,
   deleteBook,
   getAllBooks,
   getAllCategory,
   upDateBook,
   filterAndSearch,
} from 'api/book';
import SnackBar from 'components/Common/SnackBar';
import EditDiaLog from './EditBookDialog';
import AddNewBookDialog from './AddBookDialog';
import DeleteDialog from './DeleteDialog';

function Books() {
   const [openEditDialog, setOpenEditDialog] = useState(false);

   const [openAddDialog, setOpenAddDialog] = useState(false);

   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   const [openSnackBar, setOpenSnackBar] = useState(false);

   const [snackBarMessage, setSnackBarMessage] = useState('');

   const [selectedRow, setSelectedRow] = useState({});

   const [category, setCategory] = useState([]);

   const [rows, setRows] = useState([]);

   const [loading, setLoading] = useState(true);

   const [searchBook, setSearchBook] = useState('');

   const [filterCategory, setFilterCategory] = useState({ name: 'All', id: 0 });

   const columns = useMemo(
      () => [
         { field: 'id', headerName: 'ID', width: 90 },
         { field: 'name', headerName: 'Name', width: 350 },
         {
            field: 'category',
            headerName: 'Category',
            width: 150,
            renderCell: params => <span>{params.value.name}</span>,
         },
         {
            field: 'author',
            headerName: 'Author',
            width: 150,
         },
         {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            width: 150,
         },
         {
            field: 'edit',
            headerName: 'Edit',
            width: 110,
            renderCell: params => (
               <button
                  className="data-grid-btn edit-btn"
                  onClick={editButtonClick}
               >
                  <FontAwesomeIcon icon={faPenAlt}></FontAwesomeIcon>
                  <span>Edit</span>
               </button>
            ),
         },
         {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: params => (
               <button
                  className="data-grid-btn delete-btn"
                  onClick={deleteButtonClick}
               >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  <span>Delete</span>
               </button>
            ),
         },
      ],
      []
   );

   const fetchAllCategory = useCallback(async () => {
      const data = await getAllCategory();
      if (data !== null) {
         setCategory(data);
      }
   }, []);

   const refactorRowData = useCallback(data => {
      const rowData = [];
      for (const element of data) {
         rowData.push({
            id: element.id,
            name: element.title,
            category: element.type,
            author: element.author,
            amount: element.currentAmount,
         });
      }
      return rowData;
   }, []);

   const fetchAllBook = useCallback(async () => {
      setLoading(true);
      let data;
      const cacheData = cache.get('api/books');
      if (cacheData) {
         data = cacheData;
      } else {
         data = await getAllBooks();
         cache.put('api/books', data, 10000000);
      }
      if (data !== null) {
         const rowData = refactorRowData(data);
         setRows(rowData);
         setOpenSnackBar(false);
         setLoading(false);
      } else {
         setLoading(false);
         setOpenSnackBar(true);
         setSnackBarMessage('Fail to get data');
      }
   }, [refactorRowData]);

   useEffect(() => {
      fetchAllBook();
      fetchAllCategory();
   }, [fetchAllBook, fetchAllCategory]);

   const editButtonClick = el => {
      setOpenEditDialog(true);
   };

   const deleteButtonClick = el => {
      setOpenDeleteDialog(true);
   };

   const handleCellClick = el => {
      setSelectedRow(el.row);
   };

   const closeEditDialog = (newBook, isCancel) => {
      setOpenEditDialog(false);
      if (!isCancel) {
         const result = upDateBook(newBook);
         if (result) {
            setOpenSnackBar(true);
            setSnackBarMessage('Action completed loading data...');
            setTimeout(fetchAllBook, 2000);
         }
      }
   };

   const addBookClick = () => {
      setOpenAddDialog(true);
   };

   const closeAdddDialog = (newBook, isCancel) => {
      setOpenAddDialog(false);
      if (!isCancel) {
         const result = addNewBook(newBook);
         if (result) {
            setOpenSnackBar(true);
            setSnackBarMessage('Action completed loading data...');
            cache.clear();
            setTimeout(fetchAllBook, 2000);
         }
      }
   };

   const closeDeleteDialog = isConfirm => {
      setOpenDeleteDialog(false);
      if (isConfirm) {
         const result = deleteBook(selectedRow.id);
         if (result) {
            setOpenSnackBar(true);
            setSnackBarMessage('Action completed loading data...');
            cache.clear();
            setTimeout(fetchAllBook, 2000);
         }
      }
   };

   const startFilterAndSearch = useCallback(
      async (id, name) => {
         if (id === 0) {
            id = '';
         }
         setLoading(true);
         const data = await filterAndSearch(id, name);
         setLoading(false);
         if (isNull(data)) {
            alert('Found nothing');
         } else {
            const rowData = refactorRowData(data);
            setRows(rowData);
         }
      },
      [refactorRowData]
   );

   const handleKeyDown = event => {
      const value = event.target.value;
      if (value.length === 1) {
         setSearchBook('');
      }
      if (event.key === 'Enter') {
         setSearchBook(event.target.value);

         startFilterAndSearch(filterCategory.id, value);
      }
   };

   const handleSelectChange = event => {
      const foundCategory = find(category, { name: event.target.value });

      if (isUndefined(foundCategory)) {
         setFilterCategory({ name: 'All', id: 0 });
         startFilterAndSearch('', searchBook);
      } else {
         setFilterCategory(foundCategory);
         startFilterAndSearch(foundCategory.id, searchBook);
      }
   };

   return (
      <div className="data-grid">
         <div className="table">
            {loading && (
               <div className="loading-row">
                  <p>Loading...</p>
                  <div className="lds-ellipsis">
                     <div></div>
                     <div></div>
                     <div></div>
                     <div></div>
                  </div>
               </div>
            )}

            <div className="outside-button">
               <button
                  onClick={addBookClick}
                  className="add-button data-grid-btn"
               >
                  <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                  <span>Add new book</span>
               </button>
               <button className="import-button data-grid-btn">
                  <input
                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                     type="file"
                     name="file"
                     id="file"
                     className="inputFile"
                  />
                  <label htmlFor="file">
                     <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                     <span>Import from excel</span>
                  </label>
               </button>
               <input
                  placeholder="Search book"
                  onKeyDown={handleKeyDown}
                  className="search"
               ></input>
               <select
                  onChange={handleSelectChange}
                  value={filterCategory.name}
                  className="filter-category"
               >
                  <option value="All">All</option>
                  {category.map(item => (
                     <option key={item.id} value={item.name}>
                        {item.name}
                     </option>
                  ))}
               </select>
            </div>
            <DataGrid
               onCellClick={handleCellClick}
               rows={rows}
               columns={columns}
               pageSize={5}
            />
         </div>
         <EditDiaLog
            openEditDialog={openEditDialog}
            book={selectedRow}
            closeEditDialog={closeEditDialog}
            category={category}
         ></EditDiaLog>
         <AddNewBookDialog
            openAddDialog={openAddDialog}
            closeAddDialog={closeAdddDialog}
            category={category}
         ></AddNewBookDialog>
         <DeleteDialog
            closeDeleteDialog={closeDeleteDialog}
            openDeleteDialog={openDeleteDialog}
         ></DeleteDialog>
         <SnackBar
            openSnackBar={openSnackBar}
            message={snackBarMessage}
         ></SnackBar>
      </div>
   );
}

export default memo(Books);