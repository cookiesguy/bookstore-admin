import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function Statistic() {
   const handleDatePickerChange = value => {
      console.log(value);
   };

   return (
      <div className="data-grid">
         <div className="table">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
               <DatePicker
                  variant="inline"
                  openTo="year"
                  views={['year', 'month']}
                  onChange={handleDatePickerChange}
               />
            </MuiPickersUtilsProvider>
         </div>
      </div>
   );
}
