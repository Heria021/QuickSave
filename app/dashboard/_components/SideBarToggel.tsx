import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UsersRound } from 'lucide-react';
import { showBar } from '../layout';

function UsersTooltipButton() {
    const { value, setValue  } = useContext(showBar);

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full p-2"
                    onClick={()=>setValue(!value)}
                >
                    <div className="flex items-center justify-center gap-2">
                        <UsersRound size={20} strokeWidth={1.5} />
                    </div>
                </Button>
            </TooltipTrigger>
            <TooltipContent>Connections</TooltipContent>
        </Tooltip>
    );
}

export default UsersTooltipButton;