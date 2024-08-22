import { ModeToggle } from '@/components/shared/Mode'
import { Card } from '@/components/ui/card'
import { UserButton, useUser } from '@clerk/nextjs'
import React from 'react'
import AddLink from './AddButton';
import { BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Permissions from './Permissions';
import SideBarToggle from './SideBarToggel';


function Header() {
    const user = useUser();

    return (
        <div className="p-4">
            <div className="">
                <Card className="flex items-center justify-between p-4">
                    <div className="hidden sm:block">
                        <h1 className="text-4xl font-semibold tracking-wide text-gray-900">
                            <span className="text-blue-600">Quick</span><span className="text-gray-900">Save</span>
                        </h1>
                    </div>
                    <div className="">
                        <div className="rounded-md flex items-center gap-3">
                            <Tooltip>
                                <TooltipTrigger>
                                    <AddLink useCase={true} />
                                </TooltipTrigger>
                                <TooltipContent>Add Url</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Permissions />
                                </TooltipTrigger>
                                <TooltipContent>Permissions</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <SideBarToggle/>
                                </TooltipTrigger>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="outline" size={'icon'} className="rounded-full p-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <BellRing size={20} strokeWidth={1.5} />
                                        </div>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Notifications</TooltipContent>
                            </Tooltip>
                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ModeToggle />
                                    </TooltipTrigger>
                                    <TooltipContent>Night Mode</TooltipContent>
                                </Tooltip>
                                <div className="border-foreground h-[34px] border mx-4"></div>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <UserButton appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-[34px] h-[34px]",
                                            }
                                        }} />
                                    </TooltipTrigger>
                                    <TooltipContent>Account</TooltipContent>
                                </Tooltip>

                                <div className=" hidden sm:block">
                                    <h1 className='text-xs font-semibold'>{user.user?.firstName}</h1>
                                    <p className=' text-xs'>welcome back!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Header