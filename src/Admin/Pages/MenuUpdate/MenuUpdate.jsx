import React, { useEffect, useState } from 'react'
import MenuPreview from '../MenuPreview/MenuPreview'
import { useLoaderData } from 'react-router-dom'
import './MenuUpdate.css'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const MenuUpdate = ({ menuTitle }) => {
  let menuData = useLoaderData().data;

  let [menuLinks, setMenuLinks] = useState([
    {
      title: '',
      url: '',
      subMenu: [],
      hasSubMenu: false
    }
  ]);

  // Initialize menuLabel. If menuData exists and has a label, use it. Otherwise, it will be blank initially.
  let [menuLabel, setMenuLabel] = useState(menuData?.menuLabel || ''); 

  useEffect(() => {
    console.log("Menu Links: ", menuLinks);
  }, [menuLinks]);

  useEffect(() => {
    async function createMenuIfNotExist() {
      // Assuming menuData.length == 0 correctly indicates a new menu scenario
      // If menuData is an object, a better check might be !menuData || Object.keys(menuData).length === 0
      if (menuData.length === 0) { 
        try {
          let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/menu/add`, {
            menuKey: menuTitle,
            menuLabel: menuTitle // Sending menuTitle as the initial label
          });
          console.log(res.data);
          if (res.data.status === "Success") {
            // Update the menuLabel state on the frontend
            setMenuLabel(menuTitle); 
            toast.success('New menu created!', { icon: '✨' });
          } else {
             toast.error('Failed to create new menu.');
          }
        }
        catch (error) {
          console.log("Error while creating menu: " + error.message);
          toast.error('Error creating menu: ' + error.message);
        }
      } else {
        // If menuData exists, ensure menuLinks and menuLabel are set
        if (menuData.menuLinks && menuData.menuLinks.length !== 0) {
          setMenuLinks(menuData.menuLinks);
        }
        // Ensure menuLabel is also set if the menu already exists
        if (menuData.menuLabel) {
            setMenuLabel(menuData.menuLabel);
        }
      }
    }
    createMenuIfNotExist();
  }, [menuData, menuTitle]); // Added menuData and menuTitle to dependency array

  const addLink = (e) => {
    e.preventDefault();
    setMenuLinks([
      ...menuLinks,
      {
        title: '',
        url: '',
        subMenu: []
      }
    ]);
  };

  const addSubMenu = (e, linkIndex) => {
    e.preventDefault();
    let updatedLinks = [...menuLinks];
    if (!updatedLinks[linkIndex].subMenu) updatedLinks[linkIndex].subMenu = [];
    updatedLinks[linkIndex].subMenu.push({ title: '', url: '' });
    updatedLinks[linkIndex].hasSubMenu = false;
    setMenuLinks(updatedLinks);
  };

  const setSubMenu = (linkIndex, subIndex, key, value) => {
    let updatedLinks = [...menuLinks];
    updatedLinks[linkIndex].subMenu[subIndex][key] = value;
    updatedLinks[linkIndex].hasSubMenu = (updatedLinks[linkIndex].subMenu && updatedLinks[linkIndex].subMenu.length > 0);
    setMenuLinks(updatedLinks);
  };

  const deleteSubMenu = (e, linkIndex, subIndex) => {
    e.preventDefault();
    let updatedLinks = [...menuLinks];
    updatedLinks[linkIndex].subMenu = updatedLinks[linkIndex].subMenu.filter((_, idx) => idx !== subIdx);
    updatedLinks[linkIndex].hasSubMenu = updatedLinks[linkIndex].subMenu.length > 0;
    setMenuLinks(updatedLinks);
  };

  const setLink = (index, key, value) => {
    let updatedLinks = [...menuLinks];
    updatedLinks[index][key] = value;
    setMenuLinks(updatedLinks);
  };

  const deleteLink = (e, linkIndex) => {
    e.preventDefault();
    const updatedLinks = menuLinks.filter((_, index) => index !== linkIndex);
    setMenuLinks(updatedLinks);
  };

  const menuUpdateNotification = () => {
    toast.success('Menu Updated Successfully.', {
      icon: '✅',
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log("Submitting Menu Data: ", menuLinks);
    let submittedMenuData = {
      menuKey: menuTitle,
      menuLabel: menuLabel,
      menuLinks: menuLinks,
    };

    console.log("Submitted Menu Data: ", submittedMenuData);
    try {
      let response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/menu/edit`, submittedMenuData);
      if (response.data.status === "Success")
        menuUpdateNotification();
    } catch (error) {
      console.log("Error while updating menu: " + error.message)
      toast.error('Error updating menu: ' + error.message);
    }
  }

  return (
    <>
      <div className="menu-update-page">
        <h2 className='page-title'>Add Link For {menuTitle} Menu</h2>
        <div className="menu-update-and-preview">
          <form onSubmit={(e) => { submitHandler(e) }}>
            <div className="form-group">
              <label htmlFor="menuLabel">Menu Label</label>
              <input type="text" id="menuLabel" name="menuLabel" onChange={(e) => { setMenuLabel(e.target.value) }} value={menuLabel} />
            </div>
            <fieldset className="menu-links-fieldset">
              <legend>Menu Links</legend>
              {
                menuLinks.map((item, index) => {
                  return (
                    <fieldset key={index} style={{ marginBottom: '1em' }}>
                      <div className="menu-link-item">
                        <div>
                          <label htmlFor="title">Title</label>
                          <input type="text" value={item.title} placeholder="Add Link Title" onChange={((e) => { setLink(index, 'title', e.target.value) })} />
                        </div>
                        <div>
                          <label htmlFor="url">Url</label>
                          <input type="text" value={item.url} placeholder="Add Link Url" onChange={((e) => { setLink(index, 'url', e.target.value) })} />
                        </div>
                      </div>
                      {(menuLinks.length > 1) && <button className="delete-btn" onClick={(e) => { deleteLink(e, index) }}>Delete</button>}
                      {/* Submenu Section */}
                      <div className="submenu-section" style={{ marginTop: '0.5em', marginLeft: '1em' }}>
                        <label style={{ fontWeight: 'bold' }}>Submenus:</label>
                        {item.subMenu && item.subMenu.length > 0 && item.subMenu.map((sub, subIdx) => (
                          <div key={subIdx} className="submenu-item" style={{ display: 'flex', gap: '0.5em', alignItems: 'center', marginBottom: '0.5em' }}>
                            <input
                              type="text"
                              value={sub.title}
                              placeholder="Submenu Title"
                              onChange={e => setSubMenu(index, subIdx, 'title', e.target.value)}
                            />
                            <input
                              type="text"
                              value={sub.url}
                              placeholder="Submenu Url"
                              onChange={e => setSubMenu(index, subIdx, 'url', e.target.value)}
                            />
                            <button className="delete-btn" onClick={e => deleteSubMenu(e, index, subIdx)} style={{ fontSize: '0.8em' }}>Delete</button>
                          </div>
                        ))}
                        <button className="add-link-button" onClick={e => addSubMenu(e, index)} style={{ fontSize: '0.9em' }}>+ Add Submenu</button>
                      </div>
                    </fieldset>
                  );
                })
              }
              <button className="add-link-button" onClick={(e) => { addLink(e) }}> + Add Link</button>
            </fieldset>


            <button type="submit" className="submit-button">Save</button>

          </form>
          <MenuPreview menuTitle={menuTitle} menuData={menuLinks} menuDataFromBackend={menuData} />
          <Toaster />
        </div>
      </div>
    </>

  )
}

export default MenuUpdate