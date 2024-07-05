"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setInitialData,
  queryFilter,
} from "@/app/redux/features/instructorFilter/instructorFilterSlice";
import { isAdmin } from "@/apiservices/checklogin";
import { selectDataPublic as selectPackages } from "@/apiservices/travelpackageapiservices";
import { useSearchParams } from "next/navigation";

import "@/assets/css/travels.css";
import PopularChoiceGrid from "@/components/PopularChoiceGrid/PopularChoiceGrid";
import HeaderFront from "@/components/HeaderFront/HeaderFront";
import CoverElement from "@/components/CoverElement/CoverElement";
import FrontFooter from "@/components/FrontFooter/FrontFooter";
import SearchComponent from "@/components/SearchComponent/SearchComponent";
import Loader from "@/components/loader/Loader";

function page(props) {
  const searchParams = useSearchParams();
  const searchtext = searchParams.get("search");

  const activity = searchParams.get("activity");
  const country = searchParams.get("country");

  const [admin, setAdmin] = useState();
  const dispatch = useDispatch();

  const filteredPackageData = useSelector(
    (state) => state.instructorFilter.value
  );
  useEffect(() => {
    async function settingData() {
      try {
        if (activity && country) {
          const dataArray = await selectPackages({
            activeStatus: "active",
            packageType: "package",
            activity: activity,
            country: country,
          });

          const first = await dispatch(setInitialData(dataArray.data));
          if (first && searchtext) {
            dispatch(queryFilter(searchtext));
          }
        } else {
          const dataArray = await selectPackages({
            activeStatus: "active",
            packageType: "package",
          });

          dispatch(setInitialData(dataArray.data));
        }
      } catch (error) {
        console.error("Error in settingData:", error);
      }
    }
    settingData();

    async function fetchData() {
      try {
        const payload = await isAdmin();
        setAdmin(payload);
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }

    fetchData();
  }, []);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (filteredPackageData) {
    return (
      <div className="travelpage-container">
        <HeaderFront scrolledStatus={scrolled} />
        <CoverElement id={"Travel Packages"} />
        <div style={{ margin: "auto"}}>
          <SearchComponent />
          <PopularChoiceGrid detailData={filteredPackageData} />
        </div>

        <FrontFooter />
      </div>
    );
  } else {
    return <Loader/>
  }
}

export default page;
