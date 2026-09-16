// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {ArcUsd} from "../src/ArcUsd.sol";
import {ArcLaunchFactory} from "../src/ArcLaunchFactory.sol";
import {ArcBondingCurve} from "../src/ArcBondingCurve.sol";
import {ArcLauncherToken} from "../src/ArcLauncherToken.sol";
import {MockGraduationVenue} from "../src/MockGraduationVenue.sol";

contract ArcLaunchpadTest is Test {
    MockGraduationVenue internal venue;
    ArcLaunchFactory internal factory;
    address internal alice = address(0xA11CE);
    address internal attacker = address(0xBAD);
    address internal treasury = address(0xBEEF);

    function setUp() public {
        venue = new MockGraduationVenue();
        factory = new ArcLaunchFactory(address(venue), treasury, 0, 0);
        vm.deal(alice, 1_000_000 ether);
        vm.deal(attacker, 1_000_000 ether);
    }

    function testUsd6ToNative18() public pure {
        uint256 usd6 = 69_000 * 1e6;
        uint256 native18 = ArcUsd.usd6ToNative18(usd6);
        assertEq(native18, 69_000 ether);
        assertEq(ArcUsd.native18ToUsd6(native18), usd6);
    }

    function testLaunchRecordsCreatorAndMetadata() public {
        vm.prank(alice);
        (address curveAddr, address tokenAddr) = factory.launchWithMetadata("Cloudkitty", "CKTY", "data:application/json,hello", 69_000 * 1e6);
        assertEq(factory.creatorOfCurve(curveAddr), alice);
        assertEq(ArcLauncherToken(tokenAddr).creator(), alice);
        assertEq(ArcLauncherToken(tokenAddr).metadataURI(), "data:application/json,hello");
    }

    function testLaunchAndBuy() public {
        (address curveAddr,) = factory.launch("Cloudkitty", "CKTY", 69_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);
        vm.prank(alice);
        uint256 tokens = curve.buy{value: 100 ether}(0);
        assertGt(tokens, 0);
        assertEq(curve.realNative18(), 100 ether);
        assertEq(curve.token().balanceOf(alice), tokens);
    }

    function testSellRoundTrip() public {
        (address curveAddr,) = factory.launch("Inkdrip", "INK", 69_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);
        vm.startPrank(alice);
        uint256 tokens = curve.buy{value: 50 ether}(0);
        curve.token().approve(curveAddr, tokens);
        uint256 out = curve.sell(tokens / 2, 0);
        vm.stopPrank();
        assertGt(out, 0);
        assertLt(curve.realNative18(), 50 ether);
    }

    function testFeesAccrueAndWithdrawWithoutTouchingLiquidity() public {
        ArcLaunchFactory feeFactory = new ArcLaunchFactory(address(venue), treasury, 50, 50);
        vm.prank(alice);
        (address curveAddr,) = feeFactory.launch("Fee Pop", "FEE", 69_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);
        vm.prank(alice);
        curve.buy{value: 100 ether}(0);
        assertEq(curve.realNative18(), 99 ether);
        assertEq(curve.protocolFeesAccrued(), 0.5 ether);
        assertEq(curve.creatorFeesAccrued(), 0.5 ether);
        uint256 reserveBefore = curve.realNative18();
        vm.prank(alice);
        curve.withdrawCreatorFees();
        vm.prank(treasury);
        curve.withdrawProtocolFees();
        assertEq(curve.realNative18(), reserveBefore);
        assertEq(curve.creatorFeesAccrued(), 0);
        assertEq(curve.protocolFeesAccrued(), 0);
    }

    function testVenueRejectsThirdPartyPreRegistration() public {
        (, address tokenAddr) = factory.launch("No Grief", "NOG", 1_000 * 1e6);
        vm.prank(attacker);
        vm.expectRevert(bytes("venue: curve"));
        venue.receiveLiquidity{value: 1 ether}(tokenAddr, 1 ether);
    }

    function testAtomicGraduation() public {
        (address curveAddr, address tokenAddr) = factory.launch("Burstberry", "BBRY", 1_000 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);
        vm.prank(alice);
        curve.buy{value: 1_000 ether}(0);
        assertTrue(curve.canGraduate());
        curve.graduate();
        assertEq(uint256(curve.phase()), uint256(ArcBondingCurve.Phase.Graduated));
        assertEq(curve.realNative18(), 0);
        assertEq(venue.graduatedCount(), 1);
        (address storedToken, address storedCurve, uint256 native18, uint256 tokens) = venue.positions(tokenAddr);
        assertEq(storedToken, tokenAddr);
        assertEq(storedCurve, curveAddr);
        assertEq(native18, 1_000 ether);
        assertGt(tokens, 0);
    }

    function testCannotBuyAfterGraduate() public {
        (address curveAddr,) = factory.launch("Softorb", "ORB", 500 * 1e6);
        ArcBondingCurve curve = ArcBondingCurve(curveAddr);
        vm.prank(alice);
        curve.buy{value: 500 ether}(0);
        curve.graduate();
        vm.prank(alice);
        vm.expectRevert(bytes("curve: phase"));
        curve.buy{value: 1 ether}(0);
    }
}
