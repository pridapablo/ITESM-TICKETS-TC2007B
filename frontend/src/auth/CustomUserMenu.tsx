// CustomUserMenu.tsx
import React, { FC, useState } from 'react';
import { Logout, MenuItemLink, UserMenu, UserMenuProps, useTranslate } from 'react-admin';
import ProfileIcon from '@mui/icons-material/Person';
import ProfileModal from './ProfileModal';

const CustomUserMenu: FC<UserMenuProps> = (props) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const translate = useTranslate();

    return (
    <UserMenu {...props}>
        <MenuItemLink
            to="#"
            primaryText={translate('resources.profile')}
            leftIcon={<ProfileIcon />}
            onClick={() => setIsProfileModalOpen(true)}
        />
        <Logout />
        <ProfileModal
            open={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
        />
    </UserMenu>
    );
};

export default CustomUserMenu;
