// import { Button } from '@/components/ui/button-1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteArrowUp, TicketMinus } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function StatisticCard5({statsData}) {
    return (
    <div className=" w-full flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl border-0 bg-white dark:bg-zinc-900  text-white">
        <CardHeader className="border-0 pb-2 pt-6">
          <CardTitle className="text-lg font-semibold text-zinc-400">Total Tickets</CardTitle>
          {/* <CardToolbar> */}
            {/* <Button className="bg-zinc-800 text-zinc-100 border-zinc-800 hover:bg-zinc-700 hover:text-zinc-100">
              <BanknoteArrowUp />
              Topup
            </Button> */}
          {/* </CardToolbar> */}
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-5">
            <span className="flex gap-4 items-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              <TicketMinus className='text-green-500' />
              {statsData.balance.toLocaleString()} 
            </span>
            {/* <span className="text-base font-semibold text-green-400 ms-2">+{statsData.delta}%</span> */}
          </div>

          <div className="border-b border-zinc-700 mb-6" />

          {/* Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 w-full mb-3">
            {statsData.statistics.map((cur) => (
              <div
                key={cur.name}
                className="space-y-2.5"
                style={{
                  width: `
                  ${cur.value === 0 ? '1px' : cur.percent},
                  %`,
                }}
              >
                <div className={cn(cur.color, 'h-2.5 w-full overflow-hidden  rounded-sm transition-all')} />

                <div key={cur.name} className="flex flex-col items-start flex-1">
                  <span className="text-xs text-zinc-400 font-medium">{cur.name}</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-white">{cur.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
