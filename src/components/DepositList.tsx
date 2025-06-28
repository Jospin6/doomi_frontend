'use client';
import { DepositAction, ProductDeposit } from '@/types/deposit';
import { useState } from 'react';
// import { DataTable } from '@/components/ui/data-table';
// import { depositColumns } from './deposit-columns';

export function DepositList({ initialData }: { initialData: ProductDeposit[] }) {
    const [deposits, setDeposits] = useState(initialData);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleAction = async (depositId: string, action: DepositAction) => {
        setIsProcessing(depositId);
        try {
            const res = await fetch(`/api/deposits/${depositId}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action)
            });
            const updatedDeposit = await res.json();
            setDeposits(deposits.map(d =>
                d.id === depositId ? updatedDeposit : d
            ));
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div>
            {/* <DataTable
                columns={depositColumns(handleAction, isProcessing)}
                data={deposits}
            /> */}
        </div>
    );
}