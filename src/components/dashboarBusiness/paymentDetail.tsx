import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/animate-ui/radix/dialog';
import React from 'react';

interface paymentDetailProps{
    paymentId: string;
    note: string
}
 
export const PaymentDetails:React.FC<paymentDetailProps> = ({paymentId,note}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full text-white hover:to-blue-400 bg-blue-500'>Detalles del pago</Button>
      </DialogTrigger>
 
      <DialogContent className="sm:max-w-[425px] justify-center top-[34%] left-[34%] ">
        <DialogHeader>
          <DialogTitle>Detalles del pago</DialogTitle>
          <DialogDescription>
            Aca vas a poder ver el payment ID y si el cliente te dejo alguna nota.
          </DialogDescription>
        </DialogHeader>
 
        <div className="grid gap-4 py-4">
          <p className='font-semibold'>PaymentId: {paymentId}</p>
          <p className='font-semibold'>Nota: <span className='font-normal'>{note ? note : "No hay notas"}</span></p>
        </div>
 
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button type="submit">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};