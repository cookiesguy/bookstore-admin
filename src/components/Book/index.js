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
import Loading from 'components/Common/Loading';
import ConfirmDialog from 'components/Common/ConfirmDialog';
import RenderCellExpand from 'components/Common/RenderCellExpand';
import { time } from 'Config/cache';
import EditDiaLog from './EditBookDialog';
import AddNewBookDialog from './AddBookDialog';

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
         {
            field: 'name',
            headerName: 'Name',
            width: 350,
            renderCell: RenderCellExpand,
         },
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
      let data;
      const cacheData = cache.get('api/books');
      if (cacheData) {
         data = cacheData;
      } else {
         data = await getAllBooks();
         cache.put('api/books', data, time);
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

   const editButtonClick = el => {
      setOpenEditDialog(true);
   };

   const deleteButtonClick = el => {
      setOpenDeleteDialog(true);
   };

   const handleCellClick = el => {
      setSelectedRow(el.row);
   };

   const closeEditDialog = async (newBook, isCancel) => {
      setOpenEditDialog(false);
      if (!isCancel) {
         setLoading(true);
         cache.clear();
         const result = await upDateBook(newBook);
         if (result) {
            setSnackBarMessage('Action completed loading data...');
            setOpenSnackBar(true);

            fetchAllBook();
         } else {
            setSnackBarMessage('Fail to update data...');
            setOpenSnackBar(true);

            setLoading(false);
         }
      }
   };

   const closeSnackBar = () => {
      setOpenSnackBar(false);
   };

   const addBookClick = () => {
      setOpenAddDialog(true);
   };

   const closeAdddDialog = async (newBook, isCancel) => {
      setOpenAddDialog(false);
      if (!isCancel) {
         setLoading(true);
         const result = await addNewBook(newBook);
         if (result) {
            setSnackBarMessage('Action completed loading data...');
            setOpenSnackBar(true);

            cache.clear();
            fetchAllBook();
         } else {
            setLoading(false);
            setSnackBarMessage('Fail to add data...');
            setOpenSnackBar(true);
         }
      }
   };

   const closeDeleteDialog = async isConfirm => {
      setOpenDeleteDialog(false);
      if (isConfirm) {
         setLoading(true);
         const result = await deleteBook(selectedRow.id);
         if (result) {
            setSnackBarMessage('Action completed loading data...');
            setOpenSnackBar(true);

            cache.clear();
            fetchAllBook();
         } else {
            setLoading(false);
            setSnackBarMessage('Cannot delete, system error..');
            setOpenSnackBar(true);
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

   useEffect(() => {
      fetchAllBook();
      fetchAllCategory();
   }, [fetchAllBook, fetchAllCategory]);

   return (
      <div className="data-grid">
         <div className="table">
            {loading && <Loading></Loading>}
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
         <SnackBar
            open={openSnackBar}
            message={snackBarMessage}
            onClose={closeSnackBar}
         ></SnackBar>
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
         <ConfirmDialog
            close={closeDeleteDialog}
            open={openDeleteDialog}
            message="Delete this book?"
         ></ConfirmDialog>
      </div>
   );
}

export default memo(Books);
