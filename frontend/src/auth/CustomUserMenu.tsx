// CustomUserMenu.tsx
import React, { FC, useState } from 'react';
import { Logout, MenuItemLink, UserMenu, UserMenuProps } from 'react-admin';
import ProfileIcon from '@mui/icons-material/Person';
import ProfileModal from './ProfileModal';

const CustomUserMenu: FC<UserMenuProps> = (props) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
    <UserMenu {...props}>
        <MenuItemLink
            to="#"
            primaryText="Mi perfil"
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
