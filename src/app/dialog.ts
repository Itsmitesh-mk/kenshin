import { OnInit, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({ providedIn: 'root' })


export class DialogComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit() {
  } 
  
  confirmation(msg:any){
    return Swal.fire({
    title: 'Are you sure?',
    text: '',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, do it!',
    cancelButtonText: 'No, keep it'
    }).then((result) => {
    if (result.value) {
    return true;
    // For more information about handling dismissals please visit
    // https://sweetalert2.github.io/#handling-dismissals
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire(
    'Cancelled',
    'Your '+ msg +' data is not modfied :)',
    'error'
    )
    return false;
    }
    })
    }


  delete(msg){
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this '+msg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        return true;
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your '+ msg +' is safe &#x263A;',
          'error'
          )
          return false;
          
        }
      })
    }


    downloadConfirm(msg){
      return Swal.fire({
        title: 'Do you want to download '+msg+' ?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Download it!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          return true;
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            '',
            'error'
            )
            return false;
            
          }
        })
      }


    convert(msg){
      return Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this '+msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, do it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          return true;
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your '+ msg +' is not convert &#x263A;',
            'error'
            )
            return false;
            
          }
        })
      }
    
      success(){
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        }


      leadSaveSuccess() {

            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Lead Saved Successfully!',
                showConfirmButton: true
            })
      }
      
      error(msg:any) {

          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: msg,
            // footer: '<a href>Why do I have this issue?</a>'
          })
      }
      
      alertWarning(text)
      {
          Swal.fire(text);
      }


      followup(msg){

            return Swal.fire({
            
                title: 'Follow-Up',
                
                text: 'Do You Want To Create Next '+msg,
                
                type: 'warning',
                
                showCancelButton: true,
                
                confirmButtonText: 'Yes, Create it!',
                
                cancelButtonText: 'No, Leave it' })
                
                .then((result) => {if (result.value) {return true;
                
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                
                  Swal.fire('Closed','Your '+ msg +' is closed &#x263A;','error' );
                  return false; 
                }
            })
        
        }
      
    }