import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { UserPlus2, Users } from 'lucide-react'
import React from 'react'
import { UserSearch } from './UserSearch'

type Props = {}

const Permissions = (props: Props) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" size={'icon'} className="rounded-full p-2">
                    <div className="flex items-center justify-center gap-2">
                        <UserPlus2 size={20} strokeWidth={1.5} />
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="">
                    <UserSearch/>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Permissions